import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsExist } from '@/utils/validators/is-exists.validator'

export class AuthUsernameLoginDto {
  @ApiProperty({ example: 'abc' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsExist, ['User'], {
    message: 'Username không tồn tại',
  })
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string

  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string
}
