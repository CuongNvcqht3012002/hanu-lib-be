import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from '@/modules/roles/roles.decorator'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@/modules/roles/roles.guard'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { AdminUpdateEmployeeDto } from '@/modules/users/dto/admin-update-employee.dto'
import { UsersService } from '@/modules/users/service'
import { AdminCreateEmployeeDto } from '@/modules/users/dto/admin-create-employee'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Users')
@Controller('admin/employees')
export class AdminEmployeesController {
  constructor(private readonly employeesService: UsersService) {}

  @ApiOperation({ summary: 'Admin - Get list employees' })
  @Rights(RIGHT_ENUM.VIEW_EMPLOYEES)
  @Get()
  findList(@Query() query: CoreQueryDto) {
    return this.employeesService.findManyWithPagination(query, {
      where: { role: ROLE_ENUM.SUB_ADMIN },
    })
  }

  @ApiOperation({ summary: 'Admin - Create sub-admin - employee' })
  @Post()
  @Rights(RIGHT_ENUM.CREATE_EMPLOYEE)
  createSubAdmin(@Body() createSubAdminDto: AdminCreateEmployeeDto) {
    return this.employeesService.createSubAdmin(createSubAdminDto)
  }

  @ApiOperation({ summary: 'Admin -  Get Detail Employee' })
  @Get(':id')
  @Rights(RIGHT_ENUM.VIEW_EMPLOYEES)
  findOne(@Param('id') id: number) {
    return this.employeesService.findOne({ where: { id, role: ROLE_ENUM.SUB_ADMIN } })
  }

  @ApiOperation({ summary: 'Admin - Update Employee' })
  @Patch(':id')
  @Rights(RIGHT_ENUM.UPDATE_EMPLOYEE)
  updateOne(@Param('id') id: number, @Body() updateEmployeeDto: AdminUpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto)
  }

  @ApiOperation({ summary: 'Admin - Delete Employee' })
  @Delete(':id')
  @Rights(RIGHT_ENUM.DELETE_EMPLOYEE)
  deleteOne(@Param('id') id: number) {
    return this.employeesService.softDelete(id)
  }
}
