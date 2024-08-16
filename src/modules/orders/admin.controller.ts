import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { OrdersService } from '@/modules/orders/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { OrderQueryDto } from '@/modules/orders/dto/query-dto.dto'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { AdminCreateOrderDto } from '@/modules/orders/dto/admin-create-order.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Orders')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Admin - Get List Orders' })
  @Get()
  @Rights(RIGHT_ENUM.VIEW_ORDERS)
  findList(@Query() query: OrderQueryDto) {
    const { page, limit, status } = query
    return this.ordersService.findManyWithPagination(
      { page, limit },
      {
        where: { status },
        relations: ['user', 'room'],
      }
    )
  }

  @ApiOperation({ summary: 'Admin -  Get Detail Order' })
  @Get(':id')
  @Rights(RIGHT_ENUM.VIEW_ORDERS)
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne({
      where: { id },
      relations: ['user', 'room'],
    })
  }

  @ApiOperation({ summary: 'Admin - Create Order' })
  @Post()
  @Rights(RIGHT_ENUM.CREATE_ORDER)
  adminCreateOrder(@Body() createOrderDto: AdminCreateOrderDto) {
    console.log(createOrderDto)
    // return this.ordersService.adminCreateOrder(createOrderDto)
  }

  @ApiOperation({ summary: 'Admin - Update Order' })
  @Patch(':id')
  @Rights(RIGHT_ENUM.UPDATE_ORDER)
  updateOne(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.adminUpdateOrder(id, updateOrderDto)
  }
}
