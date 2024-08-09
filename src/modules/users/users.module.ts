import { Module } from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'modules/users/entities/user.entity'
import { IsExist } from 'src/utils/validators/is-exists.validator'
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator'
import { AdminEmployeesController } from 'src/modules/users/admin.employees.controller'
import { AdminReadersController } from 'src/modules/users/admin.readers.controler'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminEmployeesController, AdminReadersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
