import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'

export class UpdateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  status: ORDER_STATUS_ENUM

  @ApiProperty()
  @IsOptional()
  reason?: string
}
