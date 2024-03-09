import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    if (exception instanceof NotFoundException) {
      return response.redirect('/404');
    }
    console.log(exception);
    if (exception instanceof UnauthorizedException) {
      return response.redirect('/login');
    }
    if (exception instanceof BadRequestException) {
      const message = exception
        .getResponse()
        //@ts-ignore
        .message.map((str) => {
          return str[0].toUpperCase() + str.slice(1);
        })
        .join(', ');
      if (request.url === '/todo') {
        return response.redirect(`/?error=${message || 'Incorrect data!'}`);
      }
      return response.redirect(
        '/' +
          request.url.split('/').slice(-1)[0] +
          `?error=${message || 'Incorrect data!'}`,
      );
    }
    return response.redirect(301, '/error');
  }
}
