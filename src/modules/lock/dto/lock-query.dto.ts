import { TransformBoolean } from '@/decorators/transform-boolean.decorator'
import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class LockQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId?: number

  @ApiProperty({ required: false })
  @TransformBoolean()
  @IsOptional()
  isLocked?: boolean
}
