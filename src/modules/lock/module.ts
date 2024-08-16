import { AdminLocksController } from '@/modules/lock/admin.controller'
import { LocksController } from '@/modules/lock/controller'
import { LockRecord } from '@/modules/lock/entities/lockRecord.entity'
import { LockService } from '@/modules/lock/service'
import { UsersModule } from '@/modules/users/module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([LockRecord]), UsersModule],
  controllers: [AdminLocksController, LocksController],
  providers: [LockService],
  exports: [LockService],
})
export class LocksModule {}
