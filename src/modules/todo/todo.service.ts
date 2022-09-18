import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'

import { T_GetTodoById } from './models'
import { createTodoDto } from './dto'

import { PrismaService } from 'modules/prisma/prisma.service'

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getTodos(): Promise<Todo[]> {
    return await this.prisma.todo.findMany()
  }

  async getTodoById(id: string): Promise<Todo> {
    return await this.prisma.todo.findUnique({
      where: {
        id: +id,
      },
    })
  }

  async createTodo(userId: number, dto: any): Promise<Todo> {
    return await this.prisma.todo.create({
      data: { ...dto, authorId: +userId },
      include: {
        author: true,
      },
    })
  }
}
