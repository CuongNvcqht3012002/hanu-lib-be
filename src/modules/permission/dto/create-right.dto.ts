import { IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { RIGHT_ENUM } from 'src/modules/permission/enums/right.enum'

export class CreateRightDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  tag: string

  @IsNotEmpty()
  @IsEnum(RIGHT_ENUM)
  enumValue: RIGHT_ENUM
}
