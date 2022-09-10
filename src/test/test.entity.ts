import { I_Test } from './test.interface'

export class Test implements I_Test {
  id: number
  task: string
  constructor(task: string) {
    this.id = new Date().getTime()
    this.task = task
  }
}
