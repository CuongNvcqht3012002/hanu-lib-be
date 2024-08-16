import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, In, Repository } from 'typeorm'
import { Order } from '@/modules/orders/entities/order.entity'
import { CoreService } from 'src/utils/core/core-service'
import { UserCreateOrderDto } from '@/modules/orders/dto/user-create-order.dto'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { HttpBadRequest } from 'src/utils/throw-exception'

@Injectable()
export class OrdersService extends CoreService<Order> {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {
    super(ordersRepository)
  }

  // ==== ADMIN ====
  adminUpdateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const { status, reason } = updateOrderDto

    return this.update(id, {
      status,
      reason: status === ORDER_STATUS_ENUM.CANCELLED ? reason || 'Admin hủy đơn đặt phòng' : reason,
    })
  }

  // ==== USER ====
  async userCreateOrder(userId: number, createOrderDto: UserCreateOrderDto) {
    const { roomId, shift, usageDay } = createOrderDto
    const day = new Date(usageDay)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (day < today) {
      HttpBadRequest('Bạn không thể đặt lịch trước ngày hiện tại')
    }

    // Adjust the date to the start and end of the day
    const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0)
    const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59)

    // Check for existing orders with the same room, shift, and day with status PENDING or ACCEPTED
    const existingOrder = await this.ordersRepository.findOne({
      where: {
        roomId,
        shift,
        usageDay: Between(startOfDay, endOfDay),
        status: In([ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.ACCEPTED]),
      },
    })

    if (existingOrder) {
      HttpBadRequest('Ca này đã được đặt trước đó')
    }

    // Create the new order
    return this.create({
      ...createOrderDto,
      userId,
    })
  }

  async userUpdateOrder(id: number, updateOrderDto: UpdateOrderDto, userId: number) {
    const { status, reason } = updateOrderDto

    const order = await this.findOne({
      where: {
        id,
        userId,
      },
    })

    if (order.status !== ORDER_STATUS_ENUM.PENDING) {
      HttpBadRequest('Bạn không thể cập nhật trạng thái của đơn hàng này')
    }

    if (status !== ORDER_STATUS_ENUM.CANCELLED) {
      HttpBadRequest('Bạn chỉ có thể hủy đặt phòng')
    }

    return this.ordersRepository.update(id, {
      status,
      reason: status === ORDER_STATUS_ENUM.CANCELLED ? reason || 'User hủy đơn đặt phòng' : reason,
    })
  }
}
