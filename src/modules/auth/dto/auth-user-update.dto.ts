import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsPhoneNumber, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'
import { ContextAwareDto } from '@/utils/validations/context-aware.dto'

export class AuthUserUpdateDto extends ContextAwareDto {
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
}
