/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class OrderQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  search: string = ''

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Max(50)
  @Min(1)
  limit: number = 10

  @ApiProperty({ required: false, type: 'enum', enum: ORDER_STATUS_ENUM })
  @IsOptional()
  status?: ORDER_STATUS_ENUM
}
