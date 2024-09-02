import { LockQueryDto } from '@/modules/lock/dto/lock-query.dto'
import { ToggleLockReaderDto } from '@/modules/lock/dto/toggle-lock-reader.dto'
import { UpdateLockReaderDto } from '@/modules/lock/dto/update-lock-reader.dto'
import { LockService } from '@/modules/lock/service'
import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { Roles } from '@/modules/roles/roles.decorator'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Locks')
@Controller('admin/locks')
export class AdminLocksController {
  constructor(private readonly locksService: LockService) {}

  // API can be lock or unlock user
  @ApiOperation({ summary: 'Admin - Create lock user' })
  @Post()
  @Rights(RIGHT_ENUM.TOGGLE_LOCK_READER)
  adminToggleLockReader(@Body() dto: ToggleLockReaderDto) {
    return this.locksService.adminToggleLockReader(dto)
  }

  @ApiOperation({ summary: 'Admin -  Get list lock of one user or all locks' })
  @Get()
  @Rights(RIGHT_ENUM.VIEW_READERS)
  findList(@Query() query: LockQueryDto) {
    const { page, limit, userId, isLocked } = query
    return this.locksService.findManyWithPagination(
      { page, limit },
      {
        where: { userId, isLocked },
      }
    )
  }

  @ApiOperation({ summary: 'Admin -  Get detail lock' })
  @Get(':id')
  @Rights(RIGHT_ENUM.VIEW_READERS)
  findOne(@Param('id') id: number) {
    return this.locksService.findOne({
      where: { id },
    })
  }

  // can only update reason
  @ApiOperation({ summary: 'Admin - Update lock' })
  @Patch(':id')
  @Rights(RIGHT_ENUM.UPDATE_READER)
  updateOne(@Param('id') id: number, @Body() dto: UpdateLockReaderDto) {
    return this.locksService.update(id, dto)
  }

  @ApiOperation({ summary: 'Admin - Delete lock' })
  @Delete(':id')
  @Rights(RIGHT_ENUM.DELETE_READER)
  deleteOne(@Param('id') id: number) {
    return this.locksService.softDelete(id)
  }
}
