import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(40)
  text: string;
}
