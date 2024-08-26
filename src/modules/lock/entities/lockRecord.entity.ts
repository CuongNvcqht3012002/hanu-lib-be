import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CoreEntity } from '@/utils/core/core-entity'
import { User } from '@/modules/users/entities/user.entity'

@Entity()
export class LockRecord extends CoreEntity {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @Column()
  reason: string

  @Column({ nullable: true })
  isLocked: boolean
}
