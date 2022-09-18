import {
  Controller,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  Post,
  Body,
  Param,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { Todo } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'

import { TodoService } from './todo.service'
import { createTodoDto } from './dto'
import { T_GetTodoById } from './models'

@ApiBearerAuth()
@Controller('todos')
@ApiTags('Todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getTodos(): Promise<Todo[]> {
    return this.todoService.getTodos()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodoById(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  createTodo(@Req() req: Request, @Body() dto: createTodoDto): Promise<Todo> {
    const user = req.user
    console.log(user)

    return this.todoService.createTodo(user['sub'], dto)
  }
}
