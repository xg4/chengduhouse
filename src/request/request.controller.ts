import { Controller, Get, Query } from '@nestjs/common'
import { RequestService } from './request.service'

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  pull(@Query('page') page?: string) {
    return this.requestService.pull(page)
  }
}
