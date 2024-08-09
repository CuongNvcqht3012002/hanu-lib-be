import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class CoreQueryDto {
  @ApiProperty({ required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().trim() || '')
  search = ''

  @ApiProperty({ required: false, minimum: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @ApiProperty({
    required: false,
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10
}
