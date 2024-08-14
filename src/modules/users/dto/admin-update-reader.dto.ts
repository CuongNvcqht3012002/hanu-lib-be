import { AdminCreateReaderDto } from '@/modules/users/dto/admin-create-reader.dto'
import { PartialType } from '@nestjs/mapped-types'

export class AdminUpdateReaderDto extends PartialType(AdminCreateReaderDto) {}
