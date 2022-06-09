import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { comparePassword, hashPassword } from '../util'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signIn(dto: AuthDto) {
    const { username, password } = dto

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      throw new ForbiddenException('用户名密码错误')
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      throw new ForbiddenException('用户名密码错误')
    }

    return this.signToken(user)
  }

  async signToken(user: User) {
    const secret = this.config.get('JWT_SECRET')
    const payload = {
      userId: user.id,
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret,
    })
    return { accessToken }
  }

  async signUp(dto: AuthDto) {
    const { username, password } = dto

    const savedUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (savedUser) {
      throw new ForbiddenException('用户名已存在')
    }

    const hash = await hashPassword(password)

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hash,
      },
    })

    return this.signToken(user)
  }
}
