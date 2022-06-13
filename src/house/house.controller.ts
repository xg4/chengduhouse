import { Controller, Get } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser, Public } from '../auth/decorator'
import { HouseService } from './house.service'

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Public()
  @Get('houses')
  getRecentYear(@CurrentUser() user: User) {
    console.log(user, 'u')

    return this.houseService.getRecentYear()
  }

  @Get('houses/all')
  getAll() {
    return this.houseService.getAll()
  }
}
