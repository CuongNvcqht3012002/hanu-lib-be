import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, In, Repository } from 'typeorm'
import { Room } from '@/modules/rooms/entities/room.entity'
import { CoreService } from 'src/utils/core/core-service'
import { Order } from 'src/modules/orders/entities/order.entity'
import { SHIFT_TIME_ENUM } from '@/modules/orders/enums/shift_time'
import { SHIFT_STATUS_ENUM } from '@/modules/orders/enums/shift_status'

@Injectable()
export class RoomsService extends CoreService<Room> {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {
    super(roomsRepository)
  }

  async getRoomStatus(dayInput: string) {
    const dayInputWithoutTimeZone = dayInput.split(' ')[0]
    const dayFormat = new Date(dayInputWithoutTimeZone)
    const startOfDay = new Date(
      dayFormat.getFullYear(),
      dayFormat.getMonth(),
      dayFormat.getDate(),
      0,
      0,
      0
    )
    const endOfDay = new Date(
      dayFormat.getFullYear(),
      dayFormat.getMonth(),
      dayFormat.getDate(),
      23,
      59,
      59
    )

    console.log(dayInput, dayFormat)
    console.log(startOfDay, endOfDay)

    const rooms = await this.roomsRepository.find({
      order: { createdAt: 'ASC' },
    })
    const orders = await this.ordersRepository.find({
      where: {
        usageDay: Between(startOfDay, endOfDay),
      },
    })

    const shiftTime = Object.values(SHIFT_TIME_ENUM)

    const result = rooms.map((room) => {
      const listShiftStatus = shiftTime.reduce((acc, shift) => {
        const order = orders.find(
          (order) =>
            order.roomId === room.id && order.shift === shift && order.status === 'accepted'
        )

        if (order) {
          return { ...acc, [shift]: SHIFT_STATUS_ENUM.USING }
        }

        if (
          orders.find(
            (order) =>
              order.roomId === room.id && order.shift === shift && order.status === 'pending'
          )
        ) {
          return { ...acc, [shift]: SHIFT_STATUS_ENUM.BOOKED }
        }

        return { ...acc, [shift]: SHIFT_STATUS_ENUM.AVAILABLE }
      }, {})

      return { ...room, listShift: listShiftStatus }
    })

    return result
  }

  async getOrderByRoomIdAndShiftAndDay(roomId: number, shift: SHIFT_TIME_ENUM, day: string) {
    const dayInputWithoutTimeZone = day.split(' ')[0]
    const dayFormat = new Date(dayInputWithoutTimeZone)

    const startOfDay = new Date(
      dayFormat.getFullYear(),
      dayFormat.getMonth(),
      dayFormat.getDate(),
      0,
      0,
      0
    )
    const endOfDay = new Date(
      dayFormat.getFullYear(),
      dayFormat.getMonth(),
      dayFormat.getDate(),
      23,
      59,
      59
    )

    console.log(day, dayFormat)
    console.log(startOfDay, endOfDay)

    const order = await this.ordersRepository.findOne({
      where: {
        roomId,
        shift,
        usageDay: Between(startOfDay, endOfDay),
        status: In(['accepted', 'pending']),
      },
      relations: ['user', 'room'],
    })

    return order
  }
}
