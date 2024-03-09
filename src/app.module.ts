import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { LibModule } from './lib/lib.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [AuthModule, DbModule, LibModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
