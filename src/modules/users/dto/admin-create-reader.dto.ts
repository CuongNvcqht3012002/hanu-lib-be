import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Validate } from 'class-validator'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'
import { ContextAwareDto } from '@/utils/validations/context-aware.dto'

export class AdminCreateReaderDto extends ContextAwareDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string

  @ApiProperty()
  @Validate(IsNotExist, ['User'], {
    message: 'Mã sinh viên/bạn đọc đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Mã sinh viên/bạn đọc không được để trống' })
  @IsOptional()
  username?: string

  @ApiProperty()
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  phoneNumber?: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string
}
