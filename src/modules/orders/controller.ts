import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { OrdersService } from '@/modules/orders/service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { CreateOrderDto } from '@/modules/orders/dto/create-order.dto'
import { OrderQueryDto } from '@/modules/orders/dto/query-dto.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER, ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'User - Get list own orders' })
  @Get()
  findAll(@CurrentUser() user: User, @Query() query: OrderQueryDto) {
    return this.ordersService.findListOrdersByUser(user.id, query)
  }

  @ApiOperation({ summary: 'User -  Get Detail Order' })
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.ordersService.findOneOrderByUser({ id, userId: user.id })
  }

  @ApiOperation({ summary: 'User - Update Order' })
  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: User
  ) {
    return this.ordersService.updateOrderByUser(id, updateOrderDto, user.id)
  }

  @ApiOperation({ summary: 'User - Create Order' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.createOrder(user.id, createOrderDto)
  }
}
