import { Body, Controller, Get, Post, Query, UseGuards, Patch } from '@nestjs/common'
import { AuthService } from '@/modules/auth/service'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthResetPasswordDto } from '@/modules/auth/dto/auth-reset-password.dto'
import { AuthEmailRegisterDto } from '@/modules/auth/dto/auth-email-register.dto'
import { AuthForgotPasswordDto } from 'src/modules/auth/dto/auth-forgot-password.dto'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { Roles } from '@/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { User } from '@/modules/users/entities/user.entity'
import { AuthUserUpdateDto } from '@/modules/auth/dto/auth-user-update.dto'
import { AuthUpdatePassword } from '@/modules/auth/dto/auth-update-password.dto'
import { AuthRefreshTokenDto } from '@/modules/auth/dto/auth-refresh-token.dto'
import { AuthUsernameLoginDto } from '@/modules/auth/dto/auth-username-login.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'User - Register by email' })
  @Post('email/register')
  register(@Body() createUserDto: AuthEmailRegisterDto) {
    return this.service.register(createUserDto)
  }

  @ApiOperation({ summary: 'User - Verify email' })
  @Get('email/verify')
  verifyEmail(@Query('token') token: string) {
    return this.service.verifyEmailAndCreateUser(token)
  }

  @ApiOperation({ summary: 'User - Login' })
  @Post('email/login')
  public login(@Body() loginDto: AuthUsernameLoginDto) {
    return this.service.validateUserLogin(loginDto)
  }

  @ApiOperation({ summary: 'User - Send forgot password email' })
  @Post('email/send-forgot-password')
  forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.service.sendMailForgotPassword(forgotPasswordDto)
  }

  @ApiOperation({ summary: 'User - Send reset password' })
  @Post('email/reset-password')
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto)
  }

  @ApiOperation({ summary: 'User - Get information' })
  @ApiBearerAuth()
  @Get('me')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public getMe(@CurrentUser() user: User) {
    return this.service.me(user)
  }

  @ApiOperation({ summary: 'User - Update information' })
  @ApiBearerAuth()
  @Patch('me')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updateInformation(@CurrentUser() user: User, @Body() dto: AuthUserUpdateDto) {
    return this.service.updateInformation(user.id, dto)
  }

  @ApiOperation({ summary: 'User - Update password' })
  @ApiBearerAuth()
  @Patch('update-password')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updatePassword(@CurrentUser() user: User, @Body() dto: AuthUpdatePassword) {
    return this.service.updatePassword(user, dto)
  }

  @ApiOperation({ summary: 'User - Refresh token' })
  @Post('refresh-token')
  public refreshToken(@Body() dto: AuthRefreshTokenDto) {
    return this.service.refreshToken(dto)
  }
}
