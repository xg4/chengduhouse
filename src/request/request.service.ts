import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Prisma } from '@prisma/client'
import { load } from 'cheerio'
import dayjs from 'dayjs'
import { head, isNil, omitBy } from 'lodash'
import { setTimeout } from 'timers/promises'
import { fetch } from 'undici'
import { PrismaService } from '../prisma/prisma.service'
import { buildURL } from '../util'

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async job() {
    this.logger.debug(
      'pull request start ' + dayjs().format('YYYY-MM-DD HH:mm:ss'),
    )
    await this.pull()
    this.logger.debug(
      'pull request end ' + dayjs().format('YYYY-MM-DD HH:mm:ss'),
    )
  }

  parse(data: string) {
    const $ = load(data)
    const trList: string[][] = []
    $('#_projectInfo > tr').each((_, tr) => {
      const tdList: string[] = []
      $(tr)
        .find('td')
        .each((_, td) => {
          tdList.push($(td).text())
        })

      trList.push(tdList)
    })
    return trList
  }

  filterData(data: string[]): Prisma.HouseCreateInput {
    const [
      uuid,
      _,
      region,
      name,
      certificateNumber,
      range,
      quantity,
      phoneNumber,
      startAt,
      endsAt,
      freezeDate,
      freeze2Date,
      qualificationDate,
      status,
    ] = data
    const house = {
      uuid,
      region,
      name,
      certificateNumber,
      range,
      quantity: Number(quantity),
      phoneNumber,
      startAt: dayjs.tz(startAt, 'Asia/Shanghai').toDate(),
      endsAt: dayjs.tz(endsAt, 'Asia/Shanghai').toDate(),
      freezeDate: freezeDate
        ? dayjs.tz(freezeDate, 'Asia/Shanghai').toDate()
        : null,
      freeze2Date: freeze2Date
        ? dayjs.tz(freeze2Date, 'Asia/Shanghai').toDate()
        : null,
      qualificationDate: qualificationDate
        ? dayjs.tz(qualificationDate, 'Asia/Shanghai').toDate()
        : null,
      status,
    }
    return omitBy(house, isNil) as Prisma.HouseCreateInput
  }

  async pull(page = '1') {
    const url = buildURL(
      this.config.get('ORIGIN_URL'),
      new URLSearchParams({
        pageNo: page,
      }),
    )
    this.logger.debug('request ' + url)
    const result = await fetch(url, {
      method: 'post',
    }).then((res) => res.text())
    await setTimeout(1e3)

    const list = this.parse(result)
    if (!list.length) {
      return
    }

    const first = head(list)

    // 数据异常
    if (first && first[14] !== '查看') {
      this.logger.error('原数据异常')
      throw new InternalServerErrorException()
    }

    const houses = list.map(this.filterData)
    for (const h of houses) {
      await this.saveOrUpdate(h)
    }
    return houses
  }

  saveOrUpdate(house: Prisma.HouseCreateInput) {
    return this.prisma.house.upsert({
      where: {
        uuid: house.uuid,
      },
      update: house,
      create: house,
    })
  }
}
