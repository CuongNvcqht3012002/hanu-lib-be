import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminOrdersController } from 'src/modules/orders/admin.controller'
import { OrdersService } from 'src/modules/orders/service'
import { Order } from 'src/modules/orders/entities/order.entity'
import { OrdersController } from '@/modules/orders/controller'

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [AdminOrdersController, OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
