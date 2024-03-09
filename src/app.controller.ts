import {
  Controller,
  Get,
  Header,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  @Render('index')
  async root(@Req() req: Request, @Query('error') error) {
    const auth = await this.appService.auth(req);
    return { user: auth.user, todos: auth.user.todo, error };
  }

  @Get('/registration')
  @Render('registration')
  async registration(@Query('error') error, @Req() req) {
    const auth = await this.appService.auth(req);
    return { error, user: auth.user };
  }

  @Get('/login')
  @Render('login')
  async login(@Req() req, @Res() res: Response, @Query('error') error) {
    const auth = await this.appService.auth(req);
    return { error, user: auth.user };
  }

  @Get('/404')
  @Render('404')
  async notFound(@Req() req) {
    const auth = await this.appService.auth(req);
    return { user: auth.user };
  }

  @Get('/error')
  @Render('error')
  async error(@Req() req) {
    const auth = await this.appService.auth(req);
    return { user: auth.user };
  }
}
