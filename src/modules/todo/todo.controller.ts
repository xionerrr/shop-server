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
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched todos.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodos(@Req() req: Request): Promise<Omit<Todo, 'authorId'>[]> {
    const user = req.user
    return this.todoService.getTodos(user['sub'])
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched todo.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodoById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created todo.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  createTodo(@Req() req: Request, @Body() dto: createTodoDto): Promise<Todo> {
    const user = req.user
    return this.todoService.createTodo(user['sub'], dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated todo.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  updateTodo(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted todo.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  deleteTodo(@Param('id') id: string): Promise<Todo> {
    return this.todoService.deleteTodo(id)
  }
}
