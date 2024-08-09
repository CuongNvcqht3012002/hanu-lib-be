import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty({ example: 'Nhóm quản lí user' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Tên nhóm không được để trống' })
  name: string
}
