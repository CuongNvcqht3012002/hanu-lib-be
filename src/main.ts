import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { useContainer } from 'class-validator'
import validationOptions from '@/utils/validation-options'

import setupSwagger from 'src/setupSwagger'
import * as compression from 'compression'
import helmet from 'helmet'
import { ResponseInterceptor } from 'src/interceptors/response.interceptor'
// import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor'
import { BaseExceptionFilter } from '@/exceptions/exception.filter'
import { AppModule } from '@/modules/app/module'
import { ContextInterceptor } from '@/interceptors/context.interceptor'
import { RemoveContextPipe } from '@/utils/validations/remove-context-aware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  const configService = app.get(ConfigService)

  app.enableShutdownHooks()

  // Swagger
  setupSwagger(app)

  // Helmet
  app.use(helmet())

  // Compression
  app.use(compression())

  // Cors
  // app.enableCors({
  //   origin: [configService.get('app.frontendDomain')],
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'PUT', 'OPTIONS'],
  //   credentials: true,
  // })
  app.enableCors()

  // Validation
  // we have to remove context from the dto after checking the validation
  app.useGlobalPipes(new ValidationPipe(validationOptions), new RemoveContextPipe())

  // Exception => Define the common error response
  app.useGlobalFilters(new BaseExceptionFilter())

  // Interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // Interceptor => Define the common success response
  app.useGlobalInterceptors(new ResponseInterceptor())

  // Interceptor => So that at DTO we can accept the request context
  app.useGlobalInterceptors(new ContextInterceptor())

  // Interceptor => Response error if request timeout
  // app.useGlobalInterceptors(new TimeoutInterceptor(configService))

  await app.listen(configService.get('app.port'))
}

void bootstrap()
