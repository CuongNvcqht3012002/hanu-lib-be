import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AppService } from 'src/modules/app/service'

@ApiTags('HANU Library')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'User - Hello HANU Library' })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
