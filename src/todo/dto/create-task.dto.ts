import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  text: string;

  deadline?: string;
}
