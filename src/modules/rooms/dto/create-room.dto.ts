import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateRoomDto {
  @ApiProperty({ example: 'Phòng 1 Tầng 4' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  name: string
}
