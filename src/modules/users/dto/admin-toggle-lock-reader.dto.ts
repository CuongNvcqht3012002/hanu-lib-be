import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TransformBoolean } from '@/decorators/transform-boolean.decorator'

export class AdminToggleLockReaderDto {
  @ApiProperty()
  @TransformBoolean()
  @IsNotEmpty()
  isLocked: boolean
}
