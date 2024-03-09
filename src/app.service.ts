import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import { TodoService } from './todo/todo.service';

@Injectable()
export class AppService {
  constructor(
    private authService: AuthService,
    private todoService: TodoService,
  ) {}

  auth(req: Request) {
    return this.authService.auth(req);
  }

  getTodos() {
    return this.todoService.getTodos();
  }
}
