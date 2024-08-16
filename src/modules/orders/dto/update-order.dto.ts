import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'

export class UpdateOrderDto {
  @ApiProperty({ required: true, type: 'enum', enum: ORDER_STATUS_ENUM })
  @IsNotEmpty()
  status: ORDER_STATUS_ENUM

  @ApiProperty({ required: false, example: 'Lý do hủy phòng nếu có' })
  @IsOptional()
  reason?: string
}
