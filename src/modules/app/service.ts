import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is HANU Library API. Swagger API documentation is available at /swagger.'
  }
}
