import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class AuthRefreshTokenDto {
  @ApiProperty({ example: 'string' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Refresh token không được để trống.' })
  refreshToken: string
}
