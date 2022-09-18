import { Injectable, ForbiddenException } from '@nestjs/common'
import { Todo } from '@prisma/client'

import { createTodoDto, UpdateTodoDto } from './dto'

import { PrismaService } from 'modules/prisma/prisma.service'

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getTodos(authorId: string): Promise<Omit<Todo, 'authorId'>[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        authorId: +authorId,
      },
      include: {
        author: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    })
    return this.excludeMany(todos, 'authorId')
  }

  async getTodoById(id: string): Promise<Todo> {
    return await this.prisma.todo.findUnique({
      where: {
        id: +id,
      },
    })
  }

  async createTodo(userId: number, dto: createTodoDto): Promise<Todo> {
    const todo = await this.prisma.todo.create({
      data: { ...dto, authorId: +userId },
      include: {
        author: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    })
    delete todo.authorId

    return todo
  }

  async updateTodo(id: string, dto: UpdateTodoDto) {
    return await this.prisma.todo.update({
      where: {
        id: +id,
      },
      data: dto,
    })
  }

  async deleteTodo(id: string) {
    const todo = await this.prisma.todo
      .delete({
        where: {
          id: +id,
        },
      })
      .catch(() => {
        throw new ForbiddenException('Todo wasn`t found')
      })

    if (!todo) throw new ForbiddenException('Access denied')

    return todo
  }

  exclude<Todo, Key extends keyof Todo>(
    todo: Todo,
    ...keys: Key[]
  ): Omit<Todo, Key> {
    for (const key of keys) {
      delete todo[key]
    }
    return todo
  }

  excludeMany<Todo, Key extends keyof Todo>(
    todos: Todo[],
    ...keys: Key[]
  ): Omit<Todo, Key>[] {
    return todos.map((todo) => {
      for (const key of keys) {
        delete todo[key]
      }
      return todo
    })
  }
}
