import { IsExist } from '@/utils/validations/is-exist.validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, Validate } from 'class-validator'

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Validate(IsExist, ['User'], {
    message: 'Email không tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  email: string
}
