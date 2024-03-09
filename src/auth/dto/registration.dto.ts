import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  name: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  password: string;
}
