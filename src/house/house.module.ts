import { Module } from '@nestjs/common'
import { HouseController } from './house.controller'
import { HouseService } from './house.service'

@Module({
  providers: [HouseService],
  controllers: [HouseController],
})
export class HouseModule {}
