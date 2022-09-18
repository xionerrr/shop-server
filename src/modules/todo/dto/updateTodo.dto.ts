import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'

export class UpdateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    required: false,
  })
  @IsString()
  description?: string

  authorEmail: string
}
