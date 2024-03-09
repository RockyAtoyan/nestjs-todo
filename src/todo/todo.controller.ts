import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Response } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createTodo(
    @Req() req,
    @Res() res: Response,
    @Body() body: CreateTodoDto,
  ) {
    await this.todoService.createTodo(body, req.user);
    return res.redirect('/');
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateTodo(@Param('id') todoId, @Body() body: UpdateTodoDto) {
    return this.todoService.updateTodo(todoId, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteTodo(@Param('id') id) {
    return this.todoService.deleteTodo(id);
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  async addTask(
    @Res() res: Response,
    @Param('id') todoId,
    @Body() body: CreateTaskDto,
  ) {
    await this.todoService.addTask(todoId, body);
    return res.redirect(`/#${todoId.split('-').join('')}`);
  }

  @UseGuards(AuthGuard)
  @Delete('/task/:id')
  deleteTask(@Param('id') id) {
    return this.todoService.deleteTask(id);
  }

  @UseGuards(AuthGuard)
  @Put('/task/:id')
  updateTask(@Param('id') id) {
    return this.todoService.updateTask(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/order/:dragId')
  changeTodosOrder(@Param('id') id, @Param('dragId') dragId) {
    return this.todoService.changeTodoOrder(id, dragId);
  }
}
