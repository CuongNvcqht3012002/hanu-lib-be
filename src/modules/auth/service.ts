import { TOKEN_TYPE_ENUM } from '@/modules/auth/enums/tokens.enum'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/modules/users/entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { AuthEmailRegisterDto } from 'src/modules/auth/dto/auth-email-register.dto'
import { UsersService } from '@/modules/users/users.service'
import { MailService } from '@/modules/mail/mail.service'
import { AuthResetPasswordDto } from '@/modules/auth/dto/auth-reset-password.dto'
import { ConfigService } from '@nestjs/config'
import { HttpNotFound, HttpUnprocessableEntity } from 'src/utils/throw-exception'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { IAuthResponse } from 'src/modules/auth/interfaces/auth-response.interface'
import { AuthStudentIdLoginDto } from 'src/modules/auth/dto/auth-student-id-login.dto'
import { AuthRefreshTokenDto } from 'src/modules/auth/dto/auth-refresh-token.dto'
import { AuthUsernameLoginDto } from '@/modules/auth/dto/auth-username-login.dto'
import { AuthForgotPasswordDto } from '@/modules/auth/dto/auth-forgot-password.dto'
import { AuthAdminUpdateDto } from '@/modules/auth/dto/auth-admin-update.dto'
import { AuthUserUpdateDto } from '@/modules/auth/dto/auth-user-update.dto'
import { AuthUpdatePassword } from '@/modules/auth/dto/auth-update-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService
  ) {}

  async encryptPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(rawPassword, salt)
    return password
  }

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
        HttpUnprocessableEntity('Token không hợp lệ hoặc đã hết hạn.')

      // Encrypt password
      const password = await this.encryptPassword(dto.password)
      const user = await this.usersService.create({ ...dto, password })
      return { user }
    } catch (error) {
      HttpUnprocessableEntity(error.message)
    }
  }

  async validateAdminLogin(loginDto: AuthUsernameLoginDto): Promise<IAuthResponse> {
    const user = await this.usersService.findOne({
      username: loginDto.username,
    })

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    // incorrect password
    if (!isValidPassword) HttpUnprocessableEntity('Mật khẩu không chính xác.')

    const tokens = await this.createTokens(user)

    return { ...tokens, user }
  }

  async validateUserLogin(loginDto: AuthStudentIdLoginDto): Promise<IAuthResponse> {
    const user = await this.usersService.findOne({
      studentId: loginDto.studentId,
    })

    // check if user is blocked
    this.usersService.isLocked(user)

    // check role
    // if (user.role !== ROLE_ENUM.USER) HttpNotFound('Tài khoản không hợp lệ.')

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    // incorrect password
    if (!isValidPassword) {
      // update count failed login attempts
      const count = await this.updateCountFailedLoginAttempts(user)

      if (count === 4) {
        await this.usersService.update(user.id, { isLocked: true })
        HttpUnprocessableEntity(
          'Bạn đã đăng nhập sai quá 5 lần. Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản lý thư viện để được hỗ trợ.'
        )
      }

      HttpUnprocessableEntity('Mật khẩu không chính xác.')
    }

    const tokens = await this.createTokens(user)

    return { ...tokens, user }
  }

  async sendMailForgotPassword(dto: AuthForgotPasswordDto) {
    const email = dto.email
    const user = await this.usersService.findOne({
      email,
    })

    // Check if user is blocked, don't send email
    this.usersService.isLocked(user)

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
        email,
      })

      const password = await this.encryptPassword(newPassword)
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

  async updateInformation(id: number, dto: AuthAdminUpdateDto | AuthUserUpdateDto) {
    await this.usersService.update(id, dto)
    const user = await this.usersService.findOne({ id })
    return { user }
  }

  async refreshToken(refreshToken: AuthRefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken.refreshToken)

      // It must be refresh token
      if (payload.type !== TOKEN_TYPE_ENUM.REFRESH_TOKEN)
        throw new UnauthorizedException('Lỗi refresh token')

      const user = await this.usersService.findOne({
        id: payload.id,
      })

      // Check if user exists or being removed
      if (!user) {
        throw new UnauthorizedException('Lỗi refresh token')
      }

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

    const password = await this.encryptPassword(dto.newPassword)
    await this.usersService.update(user.id, { password })
  }
}
