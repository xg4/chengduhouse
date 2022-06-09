import { IsNotEmpty } from 'class-validator'

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: '请输入密码',
  })
  password: string
}
