import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateAuthDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
