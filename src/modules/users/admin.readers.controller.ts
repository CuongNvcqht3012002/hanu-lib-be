import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from '@/modules/roles/roles.decorator'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { AdminCreateReaderDto } from '@/modules/users/dto/admin-create-reader.dto'
import { CoreQueryDto } from '@/utils/core/core-query.dto'
import { AdminUpdateReaderDto } from '@/modules/users/dto/admin-update-reader.dto'
import { UsersService } from '@/modules/users/service'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Users')
@Controller('admin/readers')
export class AdminReadersController {
  constructor(private readonly readersService: UsersService) {}

  @ApiOperation({ summary: 'Admin - Create reader' })
  @Post()
  @Rights(RIGHT_ENUM.CREATE_READER)
  createReader(@Body() dto: AdminCreateReaderDto) {
    return this.readersService.createReader(dto)
  }

  @ApiOperation({ summary: 'Admin - Get reader list' })
  @Get()
  @Rights(RIGHT_ENUM.VIEW_READERS)
  findList(@Query() query: CoreQueryDto) {
    return this.readersService.findManyWithPagination(query, { where: { role: ROLE_ENUM.USER } })
  }

  @ApiOperation({ summary: 'Admin -  Get detail reader' })
  @Get(':id')
  @Rights(RIGHT_ENUM.VIEW_READERS)
  findOne(@Param('id') id: number) {
    return this.readersService.findOne({
      where: { id, role: ROLE_ENUM.USER },
    })
  }

  @ApiOperation({ summary: 'Admin - Update reader' })
  @Patch(':id')
  @Rights(RIGHT_ENUM.UPDATE_READER)
  updateOne(@Param('id') id: number, @Body() dto: AdminUpdateReaderDto) {
    return this.readersService.update(id, dto)
  }

  @ApiOperation({ summary: 'Admin - Delete reader' })
  @Delete(':id')
  @Rights(RIGHT_ENUM.DELETE_READER)
  deleteOne(@Param('id') id: number) {
    return this.readersService.softDelete(id)
  }
}
