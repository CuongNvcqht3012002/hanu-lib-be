import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthService } from '@/modules/auth/service'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthResetPasswordDto } from 'src/modules/auth/dto/auth-reset-password.dto'
import { AuthForgotPasswordDto } from 'src/modules/auth/dto/auth-forgot-password.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { User } from 'src/modules/users/entities/user.entity'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { AuthRefreshTokenDto } from 'src/modules/auth/dto/auth-refresh-token.dto'
import { AuthUsernameLoginDto } from '@/modules/auth/dto/auth-username-login.dto'
import { AuthAdminUpdateDto } from '@/modules/auth/dto/auth-admin-update.dto'
import { AuthUpdatePassword } from '@/modules/auth/dto/auth-update-password.dto'

@ApiTags('Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'Admin - Login' })
  @Post('email/login')
  public adminLogin(@Body() dto: AuthUsernameLoginDto) {
    return this.service.validateAdminLogin(dto)
  }

  @ApiOperation({ summary: 'Admin - Send forgot password email' })
  @Post('email/send-forgot-password')
  forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return this.service.sendMailForgotPassword(dto)
  }

  @ApiOperation({ summary: 'Admin - Send reset password' })
  @Post('email/reset-password')
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto)
  }

  @ApiOperation({ summary: 'Admin - Get information' })
  @ApiBearerAuth()
  @Get('me')
  @Roles(ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public getMe(@CurrentUser() user: User) {
    return this.service.me(user)
  }

  @ApiOperation({ summary: 'Admin - Update information' })
  @ApiBearerAuth()
  @Patch('me')
  @Roles(ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updateInformation(@CurrentUser() user: User, @Body() dto: AuthAdminUpdateDto) {
    return this.service.updateInformation(user.id, dto)
  }

  @ApiOperation({ summary: 'Admin - Update password' })
  @ApiBearerAuth()
  @Patch('update-password')
  @Roles(ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updatePassword(@CurrentUser() user: User, @Body() dto: AuthUpdatePassword) {
    return this.service.updatePassword(user, dto)
  }

  @ApiOperation({ summary: 'Admin - Refresh token' })
  @Post('refresh-token')
  public refreshToken(@Body() dto: AuthRefreshTokenDto) {
    return this.service.refreshToken(dto)
  }
}
