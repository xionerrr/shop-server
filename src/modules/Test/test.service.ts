import { Injectable } from '@nestjs/common'
import { Test } from './models/Test.entity'
import { I_Test } from './models/Test.interface'

@Injectable()
export class TestService {
  private tests: I_Test[] = [
    { id: 1, task: 'test 1' },
    { id: 2, task: 'test 2' },
  ]

  getTests(): I_Test[] {
    return this.tests
  }

  getTestById(id: string): I_Test {
    return this.tests.find((test) => test.id === +id)
  }

  createTest(test: string): I_Test {
    const newTest = new Test(test)
    this.tests.push(newTest)
    return newTest
  }

  deleteTask(id: string) {
    this.tests = this.tests.filter((test) => test.id !== +id)
  }
}
