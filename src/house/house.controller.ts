import { Controller, Get } from '@nestjs/common'
import { HouseService } from './house.service'

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Get('houses')
  getAll() {
    return this.houseService.getAll()
  }
}
