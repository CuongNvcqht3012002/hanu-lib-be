import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Order } from '@/modules/orders/entities/order.entity'
import { CoreService } from 'src/utils/core/core-service'
import { UserCreateOrderDto } from '@/modules/orders/dto/user-create-order.dto'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { HttpBadRequest } from 'src/utils/throw-exception'
import { convertTo24Hour } from '@/utils/libs/time'

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
    const currentHour = today.getHours()

    day.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    if (day < today) {
      HttpBadRequest('Không thể đặt phòng cho những ngày đã qua')
    }

    // If booking for today, check if the shift time has already passed
    if (day.getTime() === today.getTime()) {
      const shiftStartHour = convertTo24Hour(shift.split('-')[0])
      if (currentHour >= shiftStartHour) {
        HttpBadRequest('Không thể đặt phòng cho những khung giờ đã qua')
      }
    }

    // Check for existing orders with the same room, shift, and day with status PENDING or ACCEPTED
    const existingOrder = await this.ordersRepository.findOne({
      where: {
        roomId,
        shift,
        usageDay: day,
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
      usageDay: day,
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
