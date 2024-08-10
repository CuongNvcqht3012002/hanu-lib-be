import { Module } from '@nestjs/common'
import { AuthController } from '@/modules/auth/controller'
import { AuthService } from '@/modules/auth/service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailModule } from '@/modules/mail/mail.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/users/entities/user.entity'
import { AdminAuthController } from '@/modules/auth/admin.controller'
import { UsersModule } from '@/modules/users/module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expiresAccessToken'),
        },
      }),
    }),
  ],
  controllers: [AdminAuthController, AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
