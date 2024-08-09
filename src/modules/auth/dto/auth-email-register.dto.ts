import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPhoneNumber, MinLength, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator'

export class AuthEmailRegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string

  @ApiProperty()
  @Validate(IsNotExist, ['User'], {
    message: 'Mã bạn đọc đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Mã bạn đọc không được để trống' })
  studentId: string

  @ApiProperty()
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phoneNumber: string

  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string
}
