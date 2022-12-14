import { ConfigService } from '@nestjs/config'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { PrismaService } from 'modules/prisma/prisma.service'
import { SignUpDto } from './dto'
import { Tokens } from './models'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUpLocal(dto: SignUpDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password)

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    })

    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRefreshToken(newUser.id, tokens.refresh_token)
    return tokens
  }

  async signInLocal(dto: SignUpDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (!user) throw new ForbiddenException('Access denied')

    const passwordMatches = await bcrypt.compare(dto.password, user.hash)

    if (!passwordMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refresh_token)
    return tokens
  }

  async logout(
    userId: number,
    userEmail: string,
  ): Promise<{ message: string }> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })

    return {
      message: `Success, logged out ${userEmail}`,
    }
  }

  async refreshTokens(
    userId: number,
    rt: string,
  ): Promise<{ new_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) throw new ForbiddenException('Access denied')

    const refreshTokenMatches = await bcrypt.compare(rt, user.hashedRt)

    if (!refreshTokenMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refresh_token)

    return {
      new_token: tokens.access_token,
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ])

    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}
