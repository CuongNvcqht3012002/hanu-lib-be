import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

export class UpdateRightInGroupDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  rightsIds: number[]
}
