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
  Put,
  Delete,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { Todo } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'

import { TodoService } from './todo.service'
import { createTodoDto, UpdateTodoDto } from './dto'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('todos')
@ApiTags('Todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getTodos(@Req() req: Request): Promise<Omit<Todo, 'authorId'>[]> {
    const user = req.user
    return this.todoService.getTodos(user['sub'])
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodoById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTodo(@Req() req: Request, @Body() dto: createTodoDto): Promise<Todo> {
    const user = req.user
    return this.todoService.createTodo(user['sub'], dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  updateTodo(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    const user = req.user
    return this.todoService.updateTodo(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteTodo(@Param('id') id: string): Promise<Todo> {
    return this.todoService.deleteTodo(id)
  }
}
