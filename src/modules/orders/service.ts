import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, In, Repository } from 'typeorm'
import { Order } from '@/modules/orders/entities/order.entity'
import { CoreService } from 'src/utils/core/core-service'
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto'
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { HttpBadRequest } from 'src/utils/throw-exception'
import { IPaginationOptions } from '@/utils/types/pagination-options'

@Injectable()
export class OrdersService extends CoreService<Order> {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {
    super(ordersRepository)
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
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
    const newOrder = this.ordersRepository.create({
      ...createOrderDto,
      userId,
    })

    return this.ordersRepository.save(newOrder)
  }

  userFindOrderList(
    userId: number,
    { page, limit, status }: IPaginationOptions & { status?: ORDER_STATUS_ENUM }
  ) {
    return this.findManyWithPagination(
      { page, limit },
      {
        where: {
          userId,
          status,
        },
        relations: ['user', 'room'],
      }
    )
  }

  adminFindOrderList({
    page,
    limit,
    status,
  }: {
    page: number
    limit: number
    status?: ORDER_STATUS_ENUM
  }) {
    return this.findManyWithPagination(
      { page, limit },
      {
        where: { status },
        relations: ['user', 'room'],
      }
    )
  }

  adminFindOneOrder({ id }: { id: number }) {
    return this.ordersRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user', 'room'],
    })
  }

  userFindOneOrder({ id, userId }: { id: number; userId: number }) {
    return this.ordersRepository.findOneOrFail({
      where: {
        id,
        userId,
      },
      relations: ['user', 'room'],
    })
  }

  async userUpdateOrder(id: number, updateOrderDto: UpdateOrderDto, userId: number) {
    const order = await this.findOne({
      where: {
        id,
        userId,
      },
    })

    if (order.status !== ORDER_STATUS_ENUM.PENDING) {
      HttpBadRequest('Bạn không thể cập nhật trạng thái của đơn hàng này')
    }

    if (updateOrderDto.status !== ORDER_STATUS_ENUM.CANCELLED) {
      HttpBadRequest('Bạn chỉ có thể hủy đặt phòng')
    }

    return this.ordersRepository.save({
      id,
      ...updateOrderDto,
    })
  }

  adminUpdateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    return this.update(id, updateOrderDto)
  }
}
