import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPhoneNumber, Validate } from 'class-validator'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'
import { ContextAwareDto } from '@/utils/validations/context-aware.dto'

export class AdminCreateReaderDto extends ContextAwareDto {
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
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string
}
