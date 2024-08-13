import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'

export class AdminCreateEmployeeDto {
  @ApiProperty({ example: 'test@example.com' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsNotEmpty()
  fullName: string
}
