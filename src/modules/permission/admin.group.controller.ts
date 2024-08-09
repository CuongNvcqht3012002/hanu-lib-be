import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { Rights } from '@/modules/permission/guard/rights.decorator'
import { RightsGuard } from '@/modules/permission/guard/rights.guard'
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateGroupDto } from 'src/modules/permission/dto/create-group.dto'
import { UpdateGroupInUserDto } from 'src/modules/permission/dto/update-group-in-user.dto'
import { UpdateGroupDto } from 'src/modules/permission/dto/update-group.dto'
import { UpdateRightInGroupDto } from 'src/modules/permission/dto/update-right-in-group.dto'
import { GroupService } from 'src/modules/permission/group.service'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'

@ApiBearerAuth()
@Roles(ROLE_ENUM.SUB_ADMIN)
@Rights(RIGHT_ENUM.SET_PERMISSIONS)
@UseGuards(AuthGuard('jwt'), RolesGuard, RightsGuard)
@ApiTags('Groups')
@Controller('admin/groups')
export class AdminGroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOperation({ summary: 'Admin - Get all groups' })
  findAll() {
    return this.groupService.findAll()
  }

  @Post()
  @ApiOperation({ summary: 'Admin - Create a new group' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Admin - Update a group' })
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin - Soft delete a group' })
  delete(@Param('id') id: number): Promise<void> {
    return this.groupService.softDelete(id)
  }

  // Right
  @Get(':id/rights')
  @ApiOperation({ summary: 'Admin - Get all rights of one group' })
  getAllRightsOfGroup(@Param('id') id: number) {
    return this.groupService.getAllRightsOfGroup(id)
  }

  @Put(':id/rights')
  @ApiOperation({ summary: 'Admin - Update rights in a group' })
  updateRightsInGroup(@Param('id') id: number, @Body() dto: UpdateRightInGroupDto) {
    return this.groupService.updateRightsInGroup(id, dto.rightsIds)
  }

  @Put('/users/update-groups')
  @ApiOperation({ summary: 'Admin - Update groups for a user' })
  updateGroupsInUser(@Body() dto: UpdateGroupInUserDto) {
    return this.groupService.updateGroupsInUser(dto.userId, dto.groupsIds)
  }

  @Get('/users/:id/groups')
  @ApiOperation({ summary: 'Admin - Get all groups of a user' })
  getAllGroupsOfUser(@Param('id') id: number) {
    return this.groupService.getAllGroupsOfUser(id)
  }
}
