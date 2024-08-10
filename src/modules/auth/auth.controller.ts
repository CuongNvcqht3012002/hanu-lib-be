import {
  Body,
  Controller,
  Get,
  Post,
  SerializeOptions,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthResetPasswordDto } from '@/modules/auth/dto/auth-reset-password.dto'
import { AuthEmailRegisterDto } from '@/modules/auth/dto/auth-email-register.dto'
import { AuthForgotPasswordDto } from 'src/modules/auth/dto/auth-forgot-password.dto'
import { AuthStudentIdLoginDto } from 'src/modules/auth/dto/auth-student-id-login.dto'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { Roles } from '@/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { User } from '@/modules/users/entities/user.entity'
import { AuthUserUpdateDto } from '@/modules/auth/dto/auth-user-update.dto'
import { AuthRefreshToken } from '@/modules/auth/dto/auth-refresh-token.dto'
import { AuthUpdatePassword } from '@/modules/auth/dto/auth-update-password.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'User - Register by email' })
  @SerializeOptions({
    groups: ['me'],
  })
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
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  public login(@Body() loginDto: AuthStudentIdLoginDto) {
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
  @Roles(ROLE_ENUM.USER, ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public getMe(@CurrentUser() user: User) {
    return this.service.me(user)
  }

  @ApiOperation({ summary: 'Admin - Update information' })
  @ApiBearerAuth()
  @Patch('me')
  @Roles(ROLE_ENUM.USER, ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updateInformation(@CurrentUser() user: User, @Body() dto: AuthUserUpdateDto) {
    return this.service.updateInformation(user.id, dto)
  }

  @ApiOperation({ summary: 'Admin - Update password' })
  @ApiBearerAuth()
  @Patch('update-password')
  @Roles(ROLE_ENUM.USER, ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updatePassword(@CurrentUser() user: User, @Body() dto: AuthUpdatePassword) {
    return this.service.updatePassword(user, dto)
  }

  @ApiOperation({ summary: 'Admin - Refresh token' })
  @Post('refresh-token')
  public refreshToken(@Body() refreshToken: AuthRefreshToken) {
    return this.service.refreshToken(refreshToken)
  }
}
