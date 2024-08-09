import { Order } from 'src/modules/orders/entities/order.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Entity, Column, OneToMany } from 'typeorm'

@Entity()
export class Room extends CoreEntity {
  @Column()
  name: string

  @OneToMany(() => Order, (order) => order.room)
  orders: Order[]
}
