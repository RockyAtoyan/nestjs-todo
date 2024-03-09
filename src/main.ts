import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { AuthExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.useStaticAssets('public');
  app.setBaseViewsDir('views');
  app.engine(
    'hbs',
    engine({
      partialsDir: 'views/partials',
      extname: 'hbs',
      helpers: {
        inc: function (number, options) {
          if (typeof number === 'undefined' || number === null) return null;
          return number + (options.hash.inc || 1);
        },
        date: function (date, options) {
          if (typeof date === 'undefined' || date === null) return null;
          return new Date(date).toLocaleString();
        },
        id: function (id, options) {
          if (typeof id === 'undefined' || id === null) return null;
          return id.split('-').join('');
        },
      },
    }),
  );
  app.setViewEngine('hbs');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AuthExceptionFilter());
  await app.listen(3000);
}
bootstrap().catch((reason) => console.log(reason));
