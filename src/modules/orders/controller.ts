import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { OrdersService } from '@/modules/orders/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { UserCreateOrderDto } from '@/modules/orders/dto/user-create-order.dto'
import { OrderQueryDto } from '@/modules/orders/dto/query-dto.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'User - Get my order list' })
  @Get()
  findList(@CurrentUser() user: User, @Query() query: OrderQueryDto) {
    const { page, limit, status } = query
    return this.ordersService.findManyWithPagination(
      { page, limit },
      {
        where: {
          userId: user.id,
          status,
        },
        relations: ['user', 'room'],
      }
    )
  }

  @ApiOperation({ summary: 'User -  Get Detail Order' })
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.ordersService.findOne({
      where: {
        id,
        userId: user.id,
      },
      relations: ['user', 'room'],
    })
  }

  @ApiOperation({ summary: 'User - Update Order' })
  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: User
  ) {
    return this.ordersService.userUpdateOrder(id, updateOrderDto, user.id)
  }

  @ApiOperation({ summary: 'User - Create Order' })
  @Post()
  create(@Body() createOrderDto: UserCreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.userCreateOrder(user.id, createOrderDto)
  }
}
