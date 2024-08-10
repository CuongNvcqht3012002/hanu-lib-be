import { Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/modules/users/entities/user.entity'
import { AdminEmployeesController } from 'src/modules/users/admin.employees.controller'
import { AdminReadersController } from 'src/modules/users/admin.readers.controler'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminEmployeesController, AdminReadersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
