import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength } from 'class-validator'

export class AuthUpdatePassword {
  @ApiProperty({ example: 'oldPassword123' })
  @MinLength(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống.' })
  oldPassword: string

  @ApiProperty({ example: 'newPassword123' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống.' })
  newPassword: string
}
