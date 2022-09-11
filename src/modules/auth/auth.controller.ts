import { Post, Body } from '@nestjs/common/decorators'
import { Controller } from '@nestjs/common'

import { AuthService } from './auth.service'
import { SignUpDto } from './dto'
import { Tokens } from './models'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  signUpLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto)
  }

  @Post('/local/signin')
  signInLocal() {
    this.authService.signInLocal()
  }

  @Post('/logout')
  logout() {
    this.authService.logout()
  }

  @Post('/refresh')
  refreshTokens() {
    this.authService.refreshTokens()
  }
}
