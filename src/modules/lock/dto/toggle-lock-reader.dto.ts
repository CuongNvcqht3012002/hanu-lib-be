import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { TransformBoolean } from '@/decorators/transform-boolean.decorator'

export class ToggleLockReaderDto {
  @ApiProperty()
  @TransformBoolean()
  @IsNotEmpty()
  isLocked: boolean

  @ApiProperty({ required: false, example: 'Lý do khóa' })
  @IsOptional()
  reason?: string

  @ApiProperty()
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: number
}
