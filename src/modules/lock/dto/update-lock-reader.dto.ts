import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdateLockReaderDto {
  @ApiProperty({ required: false, example: 'Lý do khóa' })
  @IsOptional()
  reason?: string
}
