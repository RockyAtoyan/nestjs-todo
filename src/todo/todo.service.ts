import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  getTodos() {
    return this.prisma.todo.findMany({
      orderBy: {
        order: 'desc',
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  createTodo(dto: CreateTodoDto, user: { id: string; name: string }) {
    return this.prisma.todo.create({
      data: {
        ...dto,
        userId: user.id,
      },
    });
  }

  updateTodo(id: string, dto: UpdateTodoDto) {
    return this.prisma.todo.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  deleteTodo(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }

  addTask(todoId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        todoId,
      },
    });
  }

  async updateTask(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    const update = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        isDone: !task.isDone,
      },
    });
    return update.isDone;
  }

  deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async changeTodoOrder(todoId: string, dragTodoId: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id: todoId } });
    const dragTodo = await this.prisma.todo.findUnique({
      where: { id: dragTodoId },
    });
    const todoOrder = todo.order;
    await this.prisma.todo.update({
      where: { id: todo.id },
      data: { order: dragTodo.order },
    });
    await this.prisma.todo.update({
      where: { id: dragTodo.id },
      data: { order: todoOrder },
    });
    return true;
  }
}
