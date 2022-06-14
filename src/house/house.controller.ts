import { Controller, Get } from '@nestjs/common'
import { Public } from '../auth/decorator'
import { HouseService } from './house.service'

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Public()
  @Get('houses')
  getRecentYear() {
    return this.houseService.getRecentYear()
  }

  @Get('houses/all')
  getAll() {
    return this.houseService.getAll()
  }
}
