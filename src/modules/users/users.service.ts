import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'modules/users/entities/user.entity'
import { CoreService } from 'src/utils/core/core-service'
import { HttpBadRequest } from 'src/utils/throw-exception'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { CreateSubAdminDto } from 'src/modules/users/dto/create-sub-admin.dto'
import * as bcrypt from 'bcryptjs'
import { AdminCreateReaderDto } from '@/modules/users/dto/admin-create-reader.dto'

@Injectable()
export class UsersService extends CoreService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super(usersRepository)
  }

  async encryptPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(rawPassword, salt)
    return password
  }

  isLocked(user: User) {
    if (user.isLocked)
      HttpBadRequest(
        'Tài khoản của bạn đang bị khóa. Vui lòng liên hệ ban quản lý thư viện để được hỗ trợ.'
      )
  }

  async createUsernameAndPasswordFromEmail(email: string) {
    const username = email.split('@')[0]
    const password = await this.encryptPassword(username)

    return { username, password }
  }

  // EMPLOYEES
  async createSubAdmin(dto: CreateSubAdminDto) {
    const usernameAndPassword = await this.createUsernameAndPasswordFromEmail(dto.email)

    return this.create({
      ...dto,
      role: ROLE_ENUM.SUB_ADMIN,
      ...usernameAndPassword,
    })
  }

  // READERS
  async toggleLockReader(userId: number, isLocked: boolean) {
    const user = await this.findOne({ id: userId })

    user.isLocked = isLocked
    user.countFailedLoginAttempts = 0

    return this.update(user.id, user)
  }

  async createReader(dto: AdminCreateReaderDto) {
    const usernameAndPassword = await this.createUsernameAndPasswordFromEmail(dto.email)

    return this.create({
      ...dto,
      role: ROLE_ENUM.USER,
      ...usernameAndPassword,
    })
  }
}
