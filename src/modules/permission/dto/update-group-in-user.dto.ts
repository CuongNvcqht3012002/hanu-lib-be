import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateGroupInUserDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  groupsIds: number[]

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: number
}
