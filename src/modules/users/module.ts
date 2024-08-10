import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/modules/users/entities/user.entity'
import { AdminEmployeesController } from '@/modules/users/admin.employees.controller'
import { AdminReadersController } from '@/modules/users/admin.readers.controller'
import { UsersService } from '@/modules/users/service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminEmployeesController, AdminReadersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
