import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.house.findMany()
  }
}
