import { Controller, Get } from '@nestjs/common'
import { Public } from '../auth/decorator'
import { HouseService } from './house.service'

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Public()
  @Get('houses')
  getAll() {
    return this.houseService.getAll()
  }
}
