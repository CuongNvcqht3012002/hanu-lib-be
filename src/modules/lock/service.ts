import { ToggleLockReaderDto } from '@/modules/lock/dto/toggle-lock-reader.dto'
import { LockRecord } from '@/modules/lock/entities/lockRecord.entity'
import { User } from '@/modules/users/entities/user.entity'
import { UsersService } from '@/modules/users/service'
import { CoreService } from '@/utils/core/core-service'
import { HttpBadRequest } from '@/utils/throw-exception'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class LockService extends CoreService<LockRecord> {
  constructor(
    @InjectRepository(LockRecord)
    private locksRepository: Repository<LockRecord>,
    private userService: UsersService
  ) {
    super(locksRepository)
  }

  isLocked(user: User) {
    if (user.isLocked)
      HttpBadRequest(
        'Tài khoản của bạn đang bị khóa. Vui lòng liên hệ ban quản lý thư viện để được hỗ trợ.'
      )
  }

  // Amin lock manually
  async adminToggleLockReader(dto: ToggleLockReaderDto) {
    const { userId, isLocked } = dto
    const user = await this.userService.findOne({ where: { id: userId } })

    user.isLocked = isLocked

    if (!isLocked) {
      user.countFailedLoginAttempts = 0
      dto.reason = dto.reason || 'Admin mở khóa tài khoản'
    } else {
      dto.reason = dto.reason || 'Admin khóa tài khoản'
    }

    await this.userService.update(user.id, user)
    return this.create(dto)
  }

  // System lock automatically
  async systemLockUser(userId: number, reason: string) {
    await this.userService.update(userId, { isLocked: true })
    return this.create({ userId, reason })
  }
}
