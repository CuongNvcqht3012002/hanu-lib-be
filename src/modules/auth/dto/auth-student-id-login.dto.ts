import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsExist } from 'src/utils/validators/is-exists.validator'
import { Transform } from 'class-transformer'

export class AuthStudentIdLoginDto {
  @ApiProperty()
  @Validate(IsExist, ['User'], {
    message: 'Mã bạn đọc không tồn tại.',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Mã bạn đọc không được để trống.' })
  studentId: string

  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string
}
