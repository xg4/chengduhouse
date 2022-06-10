import { Injectable } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(hash?: string) {
    const houses = await this.prisma.house.findMany()
    // if (hash) {
    //   const newHash = SHA256(houses.toString()).toString()
    //   if (newHash === hash) {
    //     return
    //   }
    // }
    return houses
  }
}
