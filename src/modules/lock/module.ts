import { AdminLocksController } from '@/modules/lock/admin.controller'
import { LocksController } from '@/modules/lock/controller'
import { LockRecord } from '@/modules/lock/entities/lockRecord.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([LockRecord])],
  controllers: [AdminLocksController, LocksController],
  providers: [],
  exports: [],
})
export class RoomsModule {}
