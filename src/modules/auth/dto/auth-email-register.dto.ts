import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength, Validate } from 'class-validator'
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
  @IsString({ message: 'Mã bạn đọc phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã bạn đọc không được để trống' })
  @Validate(IsNotExist, ['User'], {
    message: 'Mã bạn đọc đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  studentId: string

  @ApiProperty({ example: '+84123456789' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  phoneNumber: string

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @Transform(({ value }) => value?.trim())
  fullName: string
}
