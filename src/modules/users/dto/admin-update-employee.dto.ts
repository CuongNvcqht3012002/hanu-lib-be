// import { ApiProperty } from '@nestjs/swagger'
// import { IsNotEmpty, IsOptional, IsPhoneNumber, MinLength, Validate } from 'class-validator'
// import { Transform } from 'class-transformer'
// import { IsNotExist } from 'src/utils/validators/is-not-exists.validator'
import { CreateSubAdminDto } from '@/modules/users/dto/create-sub-admin.dto'
import { PartialType } from '@nestjs/mapped-types'

export class AdminUpdateEmployeeDto extends PartialType(CreateSubAdminDto) {
  // @ApiProperty({ example: 'test@example.com' })
  // @Transform(({ value }) => value?.trim())
  // @Validate(IsNotExist, ['User'], {
  //   message: 'Email đã tồn tại',
  // })
  // // @IsNotEmpty({ message: 'Email không được để trống' })
  // @IsOptional()
  // email?: string
  // @ApiProperty({ example: 'newUsername' })
  // @Transform(({ value }) => value?.trim())
  // @Validate(IsNotExist, ['User'], {
  //   message: 'Username đã tồn tại',
  // })
  // @IsNotEmpty({ message: 'Username không được để trống' })
  // @IsOptional()
  // username?: string
  // @ApiProperty({ example: '+1234567890' })
  // @Transform(({ value }) => value?.trim())
  // @Validate(IsNotExist, ['User'], {
  //   message: 'Số điện thoại đã tồn tại',
  // })
  // @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  // @IsOptional()
  // phoneNumber?: string
  // @ApiProperty({ example: 'John Doe' })
  // // @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  // @IsOptional()
  // fullName?: string
  // @ApiProperty({ example: 'newPassword123' })
  // @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  // @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  // @IsOptional()
  // password?: string
}
