import { SHIFT_TIME_ENUM } from '@/modules/orders/enums/shift_time'
import { ORDER_STATUS_ENUM } from '@/modules/orders/enums/order_status'
import { Room } from 'src/modules/rooms/entities/room.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm'

@Entity('orders')
@Unique(['userId', 'roomId', 'shift', 'usageDay'])
@Index(['userId', 'roomId'])
export class Order extends CoreEntity {
  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  userId: number

  @ManyToOne(() => Room, (room) => room.orders, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room

  @Column({ name: 'room_id' })
  roomId: number

  @Column({
    type: 'enum',
    enum: SHIFT_TIME_ENUM,
    nullable: false,
  })
  shift: SHIFT_TIME_ENUM

  @Column({ type: 'date', nullable: false })
  usageDay: Date

  @Column({ nullable: true })
  studentId2: string

  @Column({ nullable: true })
  studentId3: string

  @Column({ nullable: true })
  reason: string

  @Column({
    type: 'enum',
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.PENDING,
  })
  status: ORDER_STATUS_ENUM
}
