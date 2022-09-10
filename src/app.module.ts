import { Module } from '@nestjs/common'

import { TestModule } from './modules/test/test.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'

@Module({
  imports: [TestModule, AuthModule, PrismaModule],
})
export class AppModule {}
