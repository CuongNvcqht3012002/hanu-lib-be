import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/modules/users/entities/user.entity'
import { CoreService } from 'src/utils/core/core-service'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { AdminCreateEmployeeDto } from '@/modules/users/dto/admin-create-employee'
import { AdminCreateReaderDto } from '@/modules/users/dto/admin-create-reader.dto'
import { encryptPassword } from '@/utils/libs/encrypt-password'

@Injectable()
export class UsersService extends CoreService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super(usersRepository)
  }
  // this function will be used by managers
  // if email is abc@gmail.com
  // username = abc
  // password = abc
  async createUsernameAndPasswordFromEmail(email: string, usernameInput = '') {
    const username = usernameInput || email.split('@')[0]
    // create password = username
    const password = await encryptPassword(username)

    return { username, password }
  }

  // EMPLOYEES
  async createSubAdmin(dto: AdminCreateEmployeeDto) {
    const usernameAndPassword = await this.createUsernameAndPasswordFromEmail(
      dto.email,
      dto.username
    )

    return this.create({
      role: ROLE_ENUM.SUB_ADMIN,
      ...usernameAndPassword,
      ...dto,
    })
  }

  async createReader(dto: AdminCreateReaderDto) {
    const usernameAndPassword = await this.createUsernameAndPasswordFromEmail(
      dto.email,
      dto.username
    )

    return this.create({
      role: ROLE_ENUM.USER,
      ...usernameAndPassword,
      ...dto,
    })
  }
}
