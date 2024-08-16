import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { Group } from 'src/modules/permission/entities/group.entity'
import { Order } from 'src/modules/orders/entities/order.entity'
import { CoreEntity } from '@/utils/core/core-entity'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { LockRecord } from '@/modules/lock/entities/lockRecord.entity'

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true, nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  fullName: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Column({ default: false })
  isLocked: boolean

  @Column({ default: 0 })
  countFailedLoginAttempts: number

  @Column({ type: 'enum', enum: ROLE_ENUM, default: ROLE_ENUM.USER })
  role: ROLE_ENUM

  @Column({ nullable: true })
  lastLoginAt: Date

  @ManyToMany(() => Group)
  @JoinTable()
  groups: Group[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]

  rights: string[]

  @BeforeInsert()
  @BeforeUpdate()
  setUsername() {
    if (this.username) return
    this.username = this.email.split('@')[0]
  }

  @OneToMany(() => LockRecord, (lock) => lock.user)
  lockRecords: LockRecord[]
}
