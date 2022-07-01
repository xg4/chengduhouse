import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecentYear() {
    const lastYear = dayjs().subtract(1, 'year').toDate()
    return this.prisma.house.findMany({
      where: {
        startAt: {
          gte: lastYear,
        },
      },
    })
  }

  async getAll() {
    return this.prisma.house.findMany()
  }

  async getByYear(year: number) {
    const currentYear = dayjs().year(year)
    const start = currentYear.startOf('year').toDate()
    const end = currentYear.endOf('year').toDate()
    return this.prisma.house.findMany({
      where: {
        startAt: {
          gte: start,
          lte: end,
        },
      },
    })
  }
}
