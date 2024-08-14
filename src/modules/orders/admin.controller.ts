import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { OrdersService } from '@/modules/orders/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { OrderQueryDto } from '@/modules/orders/dto/query-dto.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @ApiOperation({ summary: 'Admin - Get list orders' })
  @Get()
  findList(@Query() query: OrderQueryDto) {
    const { page, limit, status } = query
    return this.ordersService.adminFindOrderList({ page, limit, status })
  }

  @ApiOperation({ summary: 'Admin -  Get Detail Order' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.adminFindOneOrder({ id })
  }

  @ApiOperation({ summary: 'Admin - Update Order' })
  @Patch(':id')
  updateOne(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.adminUpdateOrder(id, updateOrderDto)
  }
}
