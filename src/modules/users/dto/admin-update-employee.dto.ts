import { AdminCreateEmployeeDto } from '@/modules/users/dto/admin-create-employee'
import { PartialType } from '@nestjs/mapped-types'

export class AdminUpdateEmployeeDto extends PartialType(AdminCreateEmployeeDto) {}
