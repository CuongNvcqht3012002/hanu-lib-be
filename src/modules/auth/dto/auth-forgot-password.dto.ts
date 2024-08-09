import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsExist } from 'src/utils/validators/is-exists.validator'

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.trim())
  @Validate(IsExist, ['User'], {
    message: 'Email không tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string
}
