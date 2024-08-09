import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Group } from 'src/modules/permission/entities/group.entity'
import { AdminGroupController } from 'src/modules/permission/admin.group.controller'
import { GroupService } from 'src/modules/permission/group.service'
import Right from 'src/modules/permission/entities/right.entity'
import { AdminRightController } from 'src/modules/permission/admin.right.controller'
import { RightService } from 'src/modules/permission/right.service'
import { User } from 'src/modules/users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Group, Right, User])],
  providers: [GroupService, RightService],
  controllers: [AdminGroupController, AdminRightController],
})
export class GroupModule {}
