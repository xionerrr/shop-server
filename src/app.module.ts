import { Module } from '@nestjs/common'

import { TestModule } from './modules/Test/test.module'

@Module({
  imports: [TestModule],
})
export class AppModule {}
