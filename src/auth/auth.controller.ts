import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  async registration(
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: RegistrationDto,
  ) {
    const { message } = await this.authService.registration(payload, image);
    if (message) {
      return res.redirect(
        301,
        `/registration?${message ? `error=${message}` : ''}`,
      );
    }
    return res.redirect(301, `/login`);
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() payload: LoginDto) {
    const { user, message } = await this.authService.login(res, payload);
    if (message) {
      return res.redirect(`/login?${message ? `error=${message}` : ''}`);
    }
    return res.redirect('/');
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  logout(@Res() res: Response) {
    this.authService.logout(res);
    return res.redirect('/');
  }

  @Get('/auth')
  auth(@Req() req) {
    return this.authService.auth(req.user);
  }
}
