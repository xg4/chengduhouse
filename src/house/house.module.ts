import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';

@Module({
  providers: [HouseService],
  controllers: [HouseController]
})
export class HouseModule {}
