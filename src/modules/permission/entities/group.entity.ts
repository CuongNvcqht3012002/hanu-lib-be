import { Entity, ManyToMany, JoinTable, Column } from 'typeorm'
import { CoreEntity } from 'src/utils/core/core-entity'
import Right from 'src/modules/permission/entities/right.entity'

@Entity()
export class Group extends CoreEntity {
  @ManyToMany(() => Right)
  @JoinTable()
  rights: Right[]

  @Column()
  name: string
}
