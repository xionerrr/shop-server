import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { I_Test } from './models/test.interface'
import { TestService } from './test.service'

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  getTests(): I_Test[] {
    return this.testService.getTests()
  }

  @Get(':id')
  getTestById(@Param('id') id: string): I_Test {
    return this.testService.getTestById(id)
  }

  @Post()
  createTest(@Body('task') test: string): I_Test {
    return this.testService.createTest(test)
  }

  @Delete(':id')
  deleteTest(@Param('id') id: string) {
    return this.testService.deleteTask(id)
  }
}
