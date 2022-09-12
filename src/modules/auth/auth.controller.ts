import { Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { Tokens } from './models'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto)
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signInLocal(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request): Promise<{ message: string }> {
    const user = req.user
    console.log(req.user)

    return this.authService.logout(user['sub'], user['email'])
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request): Promise<{ new_token: string }> {
    const user = req.user
    return this.authService.refreshTokens(user['sub'], user['refreshToken'])
  }
}
