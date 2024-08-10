import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength } from 'class-validator'

export class AuthResetPasswordDto {
  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  newPassword: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Token không được để trống.' })
  token: string
}
