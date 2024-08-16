import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { SHIFT_TIME_ENUM } from '@/modules/orders/enums/shift_time'

export class UserCreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  roomId: number

  @ApiProperty({ required: true, type: 'enum', enum: SHIFT_TIME_ENUM })
  @IsNotEmpty()
  shift: SHIFT_TIME_ENUM

  @ApiProperty()
  @IsNotEmpty()
  usageDay: Date
}
