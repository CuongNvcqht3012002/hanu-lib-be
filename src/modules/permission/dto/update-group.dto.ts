import { PartialType } from '@nestjs/mapped-types'
import { CreateGroupDto } from 'src/modules/permission/dto/create-group.dto'

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
