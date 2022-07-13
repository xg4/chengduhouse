import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { Public } from '../auth/decorator'
import { HouseService } from './house.service'

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Public()
  @Get('houses/latest')
  getLatest() {
    return this.houseService.getLatest()
  }

  @Public()
  @Get('houses')
  getAll() {
    return this.houseService.getAll()
  }

  @Get('houses/:year')
  @Public()
  getByYear(@Param('year', ParseIntPipe) year: number) {
    return this.houseService.getByYear(year)
  }
}
