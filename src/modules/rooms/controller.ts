import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { RoomsService } from '@/modules/rooms/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { SHIFT_TIME_ENUM } from '@/modules/orders/enums/shift_time'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER, ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: 'User - Get matrix rooms and statuses' })
  @Get('status')
  getMatrixRoomsAndStatuses(@Query('day') day: string) {
    return this.roomsService.getMatrixRoomsAndStatuses(day)
  }

  @ApiOperation({ summary: 'User - Get order by room id, shift and day' })
  @Get('order')
  getOrderByRoomIdAndShiftAndDay(
    @Query('roomId') roomId: number,
    @Query('shift') shift: SHIFT_TIME_ENUM,
    @Query('day') day: string
  ) {
    return this.roomsService.getOrderByRoomIdAndShiftAndDay(roomId, shift, day)
  }
}
