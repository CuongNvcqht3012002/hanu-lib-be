import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { OrdersService } from '@/modules/orders/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { OrderQueryDto } from '@/modules/orders/dto/query-dto.dto'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { User } from '@/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN, ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @ApiOperation({ summary: 'Admin - Get list orders' })
  @Get()
  findAll(@Query() query: OrderQueryDto) {
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
  findOne(@Param('id') id: number) {
    return this.ordersService.findOneOrderByAdmin({ id })
  }

  @ApiOperation({ summary: 'Admin - Update Order' })
  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: User
  ) {
    return this.ordersService.updateOrderByAdmin(id, updateOrderDto, user)
  }
}
