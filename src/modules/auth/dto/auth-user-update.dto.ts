import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsPhoneNumber, MinLength, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'

export class AuthUserUpdateDto {
  @ApiProperty({ example: '+1234567890' })
  @Transform(({ value }) => value?.trim())
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @IsOptional()
  phoneNumber?: string

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsOptional()
  fullName?: string

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  expiredAt?: Date
}
