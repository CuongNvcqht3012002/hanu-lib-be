import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export default function (app: INestApplication) {
  // Need to update name, description, version, and addBearerAuth
  const config = new DocumentBuilder()
    .setTitle("Hanu Lib's Document")
    .setDescription('The Hanu Lib API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
