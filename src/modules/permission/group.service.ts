import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Group } from 'src/modules/permission/entities/group.entity'
import Right from 'src/modules/permission/entities/right.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { CoreService } from 'src/utils/core/core-service'
import { HttpNotFound } from 'src/utils/throw-exception'
import { In, Repository } from 'typeorm'

@Injectable()
export class GroupService extends CoreService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Right)
    private rightRepository: Repository<Right>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super(groupRepository)
  }

  getAllRightsOfGroup(groupId: number) {
    return this.findOne({ id: groupId }, false, ['rights'])
  }

  async updateGroupsInUser(userId: number, groupIds: number[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    })

    if (!user) {
      HttpNotFound()
    }

    const groups = await this.groupRepository.findBy({ id: In(groupIds) })
    user.groups = groups
    return this.userRepository.save(user)
  }

  async updateRightsInGroup(groupId: number, rightsIds: number[]) {
    const group = await this.findOne({ id: groupId }, false, ['rights'])

    const rights = await this.rightRepository.findBy({ id: In(rightsIds) })

    group.rights = rights
    return this.groupRepository.save(group)
  }

  getAllGroupsOfUser(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    })
  }
}
