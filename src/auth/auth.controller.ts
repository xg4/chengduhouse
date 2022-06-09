import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { AuthService } from './auth.service'
import { CurrentUser, Public } from './decorator'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getCurrentUser(@CurrentUser() user: User) {
    return user
  }

  @Post('signin')
  @Public()
  @HttpCode(200)
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto)
  }

  @Post('signup')
  @Public()
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto)
  }
}
