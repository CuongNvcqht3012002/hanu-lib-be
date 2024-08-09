import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Right } from 'src/modules/permission/entities/right.entity'
import { RightService } from 'src/modules/permission/right.service'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'

@ApiTags('Rights')
@Controller('admin/rights')
export class AdminRightController {
  constructor(private readonly rightService: RightService) {}

  @ApiBearerAuth()
  @Rights(RIGHT_ENUM.SET_PERMISSIONS)
  @Roles(ROLE_ENUM.SUB_ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
  @Get()
  @ApiOperation({ summary: 'Admin - Get all rights' })
  getAllRights(): Promise<Right[]> {
    return this.rightService.findAll()
  }

  @Get('seed')
  @ApiOperation({ summary: 'Admin - Seed rights data' })
  async seedRights(): Promise<void> {
    await this.rightService.seedRights()
  }
}
