import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength } from 'class-validator'

export class AuthResetPasswordDto {
  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Token không được để trống.' })
  token: string
}
