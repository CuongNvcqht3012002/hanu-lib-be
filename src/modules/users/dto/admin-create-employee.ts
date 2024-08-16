import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Validate } from 'class-validator'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'
import { ContextAwareDto } from '@/utils/validations/context-aware.dto'

export class AdminCreateEmployeeDto extends ContextAwareDto {
  @ApiProperty({ example: 'test@example.com' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string

  @ApiProperty({ required: false })
  @Validate(IsNotExist, ['User'], {
    message: 'Mã user đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Mã user không được để trống' })
  @IsOptional()
  username?: string

  @ApiProperty({ example: '+84123456789', required: false })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @Validate(IsNotExist, ['User'], {
    message: 'Số điện thoại đã tồn tại',
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  phoneNumber?: string

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string
}
