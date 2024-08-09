import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { SHIFT_TIME_ENUM } from '@/modules/orders/enums/shift_time'

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  roomId: number

  @ApiProperty()
  @IsNotEmpty()
  shift: SHIFT_TIME_ENUM

  @ApiProperty()
  @IsNotEmpty()
  usageDay: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Student ID 2 không được để trống' })
  studentId2: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Student ID 3 không được để trống' })
  studentId3: string
}
