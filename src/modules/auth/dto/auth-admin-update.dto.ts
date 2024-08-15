import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'

export class AuthAdminUpdateDto {
  @ApiProperty({ example: 'test@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string

  @ApiProperty({ example: 'newUsername', required: false })
  @IsOptional()
  @IsString({ message: 'Username phải là chuỗi' })
  @Validate(IsNotExist, ['User'], {
    message: 'Username đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  username?: string

  @ApiProperty({ example: '+84123456789', required: false })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  phoneNumber?: string

  @ApiProperty({ example: 'Nguyễn Văn A', required: false })
  @IsOptional()
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  @Transform(({ value }) => value?.trim())
  fullName?: string
}
