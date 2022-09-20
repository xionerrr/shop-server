import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './modules/auth/auth.module'
import { TodoModule } from 'modules/todo/todo.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { ChatModule } from 'modules/chat/chat.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TodoModule,
    AuthModule,
    PrismaModule,
    ChatModule,
  ],
})
export class AppModule {}
