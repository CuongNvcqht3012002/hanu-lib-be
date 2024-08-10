import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPhoneNumber, Validate } from 'class-validator'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'

export class AdminCreateReaderDto {
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

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsNotEmpty()
  expiredAt: Date

  // isLocked: boolean
  // @ApiProperty()
  // @IsNotEmpty()
  // isLocked: boolean
}
