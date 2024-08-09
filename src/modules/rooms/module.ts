import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminRoomsController } from 'src/modules/rooms/admin.controller'
import { RoomsService } from 'src/modules/rooms/service'
import { Room } from 'src/modules/rooms/entities/room.entity'
import { Order } from 'src/modules/orders/entities/order.entity'
import { RoomsController } from 'src/modules/rooms/controller'

@Module({
  imports: [TypeOrmModule.forFeature([Room, Order])],
  controllers: [AdminRoomsController, RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
