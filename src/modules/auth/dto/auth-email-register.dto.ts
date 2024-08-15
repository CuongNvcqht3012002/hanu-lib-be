import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'

export class AuthEmailRegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string

  @ApiProperty({ example: 'B1234567' })
  @IsString({ message: 'Mã sinh viên phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống' })
  @Validate(IsNotExist, ['User'], {
    message: 'Mã sinh viên đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  username: string

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @Transform(({ value }) => value?.trim())
  fullName: string
}
