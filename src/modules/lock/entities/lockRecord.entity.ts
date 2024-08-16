import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CoreEntity } from '@/utils/core/core-entity'
import { User } from '@/modules/users/entities/user.entity'

@Entity()
export class LockRecord extends CoreEntity {
  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn()
  user: User

  @Column({ nullable: true })
  userId: number

  @Column()
  reason: string
}
