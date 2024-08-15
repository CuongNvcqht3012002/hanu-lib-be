import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { TransformBoolean } from '@/decorators/transform-boolean.decorator'

export class AdminToggleLockUserDto {
  @ApiProperty()
  @TransformBoolean()
  @IsNotEmpty()
  isLocked: boolean

  @ApiProperty({ required: false, example: 'Lý do khóa' })
  @IsOptional()
  reason?: string
}
