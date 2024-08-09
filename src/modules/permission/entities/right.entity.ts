import { Entity, Column } from 'typeorm'
import { CoreEntity } from 'src/utils/core/core-entity'
import { RIGHT_ENUM } from 'src/modules/permission/enums/right.enum'

@Entity()
export class Right extends CoreEntity {
  @Column()
  tag: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: RIGHT_ENUM, unique: true })
  enumValue: RIGHT_ENUM
}

export default Right
