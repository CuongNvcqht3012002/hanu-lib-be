import { CurrentUser } from '@/decorators/current-user.decorator'
import { LockService } from '@/modules/lock/service'
import { Roles } from '@/modules/roles/roles.decorator'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { User } from '@/modules/users/entities/user.entity'
import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Locks')
@Controller('locks')
export class LocksController {
  constructor(private readonly locksService: LockService) {}

  @ApiOperation({ summary: 'User - Get my lock list' })
  @Get()
  findList(@CurrentUser() user: User, @Query() query: CoreQueryDto) {
    const { page, limit } = query
    return this.locksService.findManyWithPagination(
      { page, limit },
      {
        where: {
          userId: user.id,
        },
      }
    )
  }

  @ApiOperation({ summary: 'User -  Get Detail Order' })
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.locksService.findOne({
      where: {
        id,
        userId: user.id,
      },
    })
  }
}
