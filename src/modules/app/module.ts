import { join } from 'path'
import { Module, MiddlewareConsumer } from '@nestjs/common'
import databaseConfig from '@/config/database.config'
import authConfig from '@/config/auth.config'
import appConfig from '@/config/app.config'
import mailConfig from '@/config/mail.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from '@/database/typeorm-config.service'
import { DataSource } from 'typeorm'
import { AppLoggerMiddleware } from '@/middlewares/logger.middleware'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

import { ServeStaticModule } from '@nestjs/serve-static'
import { ScheduleModule } from '@nestjs/schedule'
import { MailerModule } from '@nestjs-modules/mailer'
import { AppController } from '@/modules/app/controller'
import { AppService } from '@/modules/app/service'
import { AuthModule } from '@/modules/auth/module'
import { MailConfigService } from '@/modules/mail/mail-config.service'
import { GroupModule } from '@/modules/permission/group.module'
import { RoomsModule } from '@/modules/rooms/module'
import { OrdersModule } from '@/modules/orders/module'
import { UsersModule } from '@/modules/users/module'
import { IsNotExist } from '@/utils/validations/is-not-exist.validator'
import { IsExist } from '@/utils/validations/is-exist.validator'
import { LocksModule } from '@/modules/lock/module'

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig],
      envFilePath: ['.env'],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('app.throttleTTL'),
        limit: config.get('app.throttleLimit'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),

    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),

    // static module
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    LocksModule,
    RoomsModule,
    OrdersModule,
    GroupModule,
  ],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    IsNotExist,
    IsExist,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }
}
