import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../auth/decorator'
import { RequestService } from './request.service'

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @Public()
  pull(@Query('page') page?: string) {
    return this.requestService.pull(page)
  }

  @Get('/count')
  @Public()
  getCount() {
    return this.requestService.getCount()
  }
}
