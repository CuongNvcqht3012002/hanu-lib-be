import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Group } from 'src/modules/permission/entities/group.entity'
import Right from 'src/modules/permission/entities/right.entity'
import { RIGHT_ENUM } from 'src/modules/permission/enums/right.enum'
import { rightMap } from 'src/modules/permission/right.map'
import { User } from 'src/modules/users/entities/user.entity'
import { HttpBadRequest, HttpNotFound } from 'src/utils/throw-exception'
import { Repository } from 'typeorm'

@Injectable()
export class RightService {
  constructor(
    @InjectRepository(Right)
    private readonly rightRepository: Repository<Right>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findAll(): Promise<Right[]> {
    return this.rightRepository.find()
  }

  validateRightMap() {
    const enumValues = Object.keys(RIGHT_ENUM) as Array<keyof typeof RIGHT_ENUM>
    const mapKeys = Object.keys(rightMap) as Array<keyof typeof RIGHT_ENUM>

    const missingInEnum = mapKeys.filter((key) => !enumValues.includes(key))
    const missingInMap = enumValues.filter((key) => !mapKeys.includes(key))

    if (missingInEnum.length > 0 || missingInMap.length > 0) {
      console.error('Discrepancies found:')
      if (missingInEnum.length > 0) {
        console.error(`Keys in rightMap but not in RIGHT_ENUM: ${missingInEnum.join(', ')}`)
      }
      if (missingInMap.length > 0) {
        console.error(`Keys in RIGHT_ENUM but not in rightMap: ${missingInMap.join(', ')}`)
      }
      HttpBadRequest('Mismatch between RIGHT_ENUM and rightMap')
    }
  }

  async seedRights() {
    // check validate right map
    this.validateRightMap()

    // Seed all rights
    const rightsToSeed = Object.values(RIGHT_ENUM).map((key) => {
      const { tag, name } = rightMap[key]
      return {
        name,
        tag,
        enumValue: key,
      }
    })

    // Filter existing rights based on enumValue
    const existingRights = await this.rightRepository.find({
      where: rightsToSeed.map((right) => ({ enumValue: right.enumValue })),
      select: ['enumValue'],
    })

    // Save non-existing rights to the database
    const rightsToSave = rightsToSeed.filter(
      (right) =>
        !existingRights.some((existingRight) => existingRight.enumValue === right.enumValue)
    )

    if (rightsToSave.length > 0) {
      await this.rightRepository.save(rightsToSave)
    }

    const allRights = await this.rightRepository.find()

    // Create the highest admin group and assign all rights to it
    // Define the name of the highest admin group
    const highestAdminGroupName = 'Nhóm quản trị cao nhất'

    let highestAdminGroup = await this.groupRepository.findOne({
      where: { name: highestAdminGroupName },
      relations: ['rights'],
    })

    if (!highestAdminGroup)
      highestAdminGroup = this.groupRepository.create({ name: highestAdminGroupName })

    highestAdminGroup.rights = allRights
    await this.groupRepository.save(highestAdminGroup)

    // Assign a user to the highest admin group
    const userEmail = 'nguyencuong3012002@gmail.com'
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      relations: ['groups'],
    })

    if (!user) {
      HttpNotFound('Hệ thống không tìm thấy người dùng admin này')
    }

    // Check if the user is already in the group
    const isInGroup = user.groups.some((group) => group.id === highestAdminGroup.id)

    if (!isInGroup) {
      user.groups.push(highestAdminGroup)
      await this.userRepository.save(user)
    }
  }
}
