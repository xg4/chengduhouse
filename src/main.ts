import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { AppModule } from './app.module'

const plugins = [utc, timezone]
plugins.forEach((p) => dayjs.extend(p))

const port = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
    }),
  )
  await app.listen(port)
}
bootstrap()
