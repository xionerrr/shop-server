import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { TestModule } from './modules/test/test.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TestModule,
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule {}
