import { encryptPassword } from '@/utils/libs/encrypt-password'
import { TOKEN_TYPE_ENUM } from '@/modules/auth/enums/tokens.enum'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/modules/users/entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { AuthEmailRegisterDto } from 'src/modules/auth/dto/auth-email-register.dto'
import { MailService } from '@/modules/mail/mail.service'
import { AuthResetPasswordDto } from '@/modules/auth/dto/auth-reset-password.dto'
import { ConfigService } from '@nestjs/config'
import { HttpUnprocessableEntity } from 'src/utils/throw-exception'
import { IAuthResponse } from 'src/modules/auth/interfaces/auth-response.interface'
import { AuthRefreshTokenDto } from 'src/modules/auth/dto/auth-refresh-token.dto'
import { AuthUsernameLoginDto } from '@/modules/auth/dto/auth-username-login.dto'
import { AuthForgotPasswordDto } from '@/modules/auth/dto/auth-forgot-password.dto'
import { AuthAdminUpdateDto } from '@/modules/auth/dto/auth-admin-update.dto'
import { AuthUserUpdateDto } from '@/modules/auth/dto/auth-user-update.dto'
import { AuthUpdatePassword } from '@/modules/auth/dto/auth-update-password.dto'
import { UsersService } from '@/modules/users/service'
import { LockService } from '@/modules/lock/service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private locksService: LockService
  ) {}

  createTokens(user: User) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        type: TOKEN_TYPE_ENUM.ACCESS_TOKEN,
      },
      { expiresIn: this.configService.get('auth.expiresAccessToken') }
    )
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        type: TOKEN_TYPE_ENUM.REFRESH_TOKEN,
      },
      { expiresIn: this.configService.get('auth.expiresRefreshToken') }
    )

    return { accessToken, refreshToken }
  }

  sendVerifyEmail(registerDto: AuthEmailRegisterDto) {
    const verifyEmailToken = this.jwtService.sign(
      {
        ...registerDto,
        type: TOKEN_TYPE_ENUM.VERIFY_EMAIL,
      },
      { expiresIn: this.configService.get('auth.codeExpires') }
    )

    this.mailService.verifyEmail({
      to: registerDto.email,
      data: {
        verifyEmailToken,
        email: registerDto.email,
        fullName: registerDto.fullName,
      },
    })
  }

  register(dto: AuthEmailRegisterDto) {
    this.sendVerifyEmail(dto)
  }

  async verifyEmailAndCreateUser(token: string) {
    try {
      const payload = await this.jwtService.verify(token)

      const { type, ...dto } = payload

      if (type !== TOKEN_TYPE_ENUM.VERIFY_EMAIL)
        HttpUnprocessableEntity('Đường dẫn không hợp lệ hoặc đã hết hạn.')

      // Encrypt password
      const password = await encryptPassword(dto.password)
      const user = await this.usersService.create({ ...dto, password })
      return { user }
    } catch (error) {
      error.error = 'Đường dẫn không hợp lệ hoặc đã hết hạn.'
      HttpUnprocessableEntity(error)
    }
  }

  async validateAdminLogin(loginDto: AuthUsernameLoginDto): Promise<IAuthResponse> {
    const user = await this.usersService.findOne({
      where: { username: loginDto.username },
    })

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    // incorrect password
    if (!isValidPassword) HttpUnprocessableEntity('Mật khẩu không chính xác.')

    const tokens = await this.createTokens(user)

    // update last login at
    await this.usersService.update(user.id, { lastLoginAt: new Date() })

    return { ...tokens, user }
  }

  async validateUserLogin(loginDto: AuthUsernameLoginDto): Promise<IAuthResponse> {
    const user = await this.usersService.findOne({
      where: { username: loginDto.username },
    })

    // check if user is blocked
    this.locksService.isLocked(user)

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    // incorrect password
    if (!isValidPassword) {
      // update count failed login attempts
      const count = await this.updateCountFailedLoginAttempts(user)

      if (count === 4) {
        await this.usersService.update(user.id, { isLocked: true })
        HttpUnprocessableEntity(
          'Bạn đã đăng nhập sai 5 lần. Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản lý thư viện để được hỗ trợ.'
        )

        this.locksService.systemLockUser(user.id, 'Hệ thống khóa tài khoản do đăng nhập sai 5 lần')
      }

      HttpUnprocessableEntity('Mật khẩu không chính xác.')
    }

    const tokens = await this.createTokens(user)

    // update last login at
    await this.usersService.update(user.id, {
      lastLoginAt: new Date(),
      countFailedLoginAttempts: 0,
    })

    return { ...tokens, user }
  }

  async sendMailForgotPassword(dto: AuthForgotPasswordDto) {
    const email = dto.email
    const user = await this.usersService.findOne({
      where: { email },
    })

    // Check if user is blocked, don't send email
    // this function will return http exception if user is blocked
    this.locksService.isLocked(user)

    const forgotPasswordToken = this.jwtService.sign(
      {
        email,
        type: TOKEN_TYPE_ENUM.FORGOT_PASSWORD,
      },
      {
        expiresIn: this.configService.get('auth.codeExpires'),
      }
    )

    this.mailService.forgotPassword({
      to: email,
      data: {
        forgotPasswordToken,
      },
    })
  }

  async resetPassword(dto: AuthResetPasswordDto): Promise<void> {
    try {
      const { newPassword, token } = dto
      const payload = await this.jwtService.verify(token)

      const { type, email } = payload

      if (type !== TOKEN_TYPE_ENUM.FORGOT_PASSWORD)
        HttpUnprocessableEntity('Token không hợp lệ hoặc đã hết hạn.')

      const user = await this.usersService.findOne({
        where: { email },
      })

      const password = await encryptPassword(newPassword)
      this.usersService.update(user.id, { password, countFailedLoginAttempts: 0 })
    } catch (error) {
      HttpUnprocessableEntity('Token không hợp lệ hoặc đã hết hạn.')
    }
  }

  // count the number of failed login attempts
  async updateCountFailedLoginAttempts(user: User) {
    await this.usersService.update(user.id, {
      countFailedLoginAttempts: user.countFailedLoginAttempts + 1,
    })
    return user.countFailedLoginAttempts
  }

  me(user: User) {
    return { user }
  }

  updateInformation(id: number, dto: AuthAdminUpdateDto | AuthUserUpdateDto) {
    return this.usersService.update(id, dto)
  }

  async refreshToken(dto: AuthRefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken)

      // It must be refresh token
      if (payload.type !== TOKEN_TYPE_ENUM.REFRESH_TOKEN)
        throw new UnauthorizedException('Lỗi refresh token')

      const user = await this.usersService.findOne({
        where: { id: payload.id },
      })

      const tokens = this.createTokens(user)
      return tokens
    } catch (error) {
      throw new UnauthorizedException('Lỗi refresh token')
    }
  }

  // update pass
  async updatePassword(user: User, dto: AuthUpdatePassword) {
    const isValidPassword = await bcrypt.compare(dto.oldPassword, user.password)

    if (!isValidPassword) HttpUnprocessableEntity('Mật khẩu cũ không chính xác.')

    const password = await encryptPassword(dto.newPassword)
    await this.usersService.update(user.id, { password })
  }
}
