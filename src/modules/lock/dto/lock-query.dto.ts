import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LockQueryDto extends CoreQueryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: number
}
