import { ROLE_ENUM } from 'modules/roles/roles.enum'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { Exclude, Expose } from 'class-transformer'
import { Group } from 'src/modules/permission/entities/group.entity'
import { Order } from 'src/modules/orders/entities/order.entity'

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true, nullable: true })
  studentId: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true, nullable: true })
  username: string

  rights: string[]

  @BeforeInsert()
  @BeforeUpdate()
  setUsername() {
    if (this.username) return
    this.username = this.email.split('@')[0]
  }

  @Column({ unique: true, nullable: true })
  phoneNumber: string

  @Column()
  fullName: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Column({ default: false })
  isLocked: boolean

  @Column({ default: 0 })
  countFailedLoginAttempts: number

  @Column({ type: 'enum', enum: ROLE_ENUM, default: ROLE_ENUM.USER })
  // @Expose({ groups: [ROLE_ENUM.ADMIN, ROLE_ENUM.SUB_ADMIN] })
  role: ROLE_ENUM

  @Column({ nullable: true })
  expiredAt: Date

  @ManyToMany(() => Group)
  @JoinTable()
  groups: Group[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]
}
