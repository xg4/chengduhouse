import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { Public } from '../auth/decorator'
import { RequestService } from './request.service'

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @Public()
  pull(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.requestService.enqueue(page)
  }

  @Get('/count')
  @Public()
  getCount() {
    return this.requestService.getCount()
  }
}
