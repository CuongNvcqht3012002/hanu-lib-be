import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { RoomsService } from '@/modules/rooms/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateRoomDto } from 'src/modules/rooms/dto/create-room.dto'
import { UpdateRoomDto } from 'src/modules/rooms/dto/update-room.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { CoreQueryDto } from '@/utils/core/core-query.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Rooms')
@Controller('admin/rooms')
export class AdminRoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: 'Admin - Create room' })
  @Post()
  @Rights(RIGHT_ENUM.CREATE_ROOM)
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto)
  }

  @ApiOperation({ summary: 'Admin - Get all rooms' })
  @Get()
  @Rights(RIGHT_ENUM.VIEW_ROOMS)
  findList(@Query() query: CoreQueryDto) {
    return this.roomsService.findManyWithPagination(query)
  }

  @ApiOperation({ summary: 'Admin -  Get detail room' })
  @Get(':id')
  @Rights(RIGHT_ENUM.VIEW_ROOMS)
  findOne(@Param('id') id: number) {
    return this.roomsService.findOne({
      where: { id },
    })
  }

  @ApiOperation({ summary: 'Admin - Update room' })
  @Patch(':id')
  @Rights(RIGHT_ENUM.UPDATE_ROOM)
  updateOne(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto)
  }

  @ApiOperation({ summary: 'Admin - Delete Room' })
  @Delete(':id')
  @Rights(RIGHT_ENUM.DELETE_ROOM)
  deleteOne(@Param('id') id: number) {
    return this.roomsService.softDelete(id)
  }
}
