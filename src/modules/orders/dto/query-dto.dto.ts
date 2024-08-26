import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class OrderQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false, type: 'enum', enum: ORDER_STATUS_ENUM })
  @IsOptional()
  status?: ORDER_STATUS_ENUM

  @ApiProperty({ required: false })
  @IsOptional()
  userId?: number
}
