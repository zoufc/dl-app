import { IsNotEmpty } from 'class-validator';

export class CreateServiceTypeDto {
  @IsNotEmpty()
  name: string;
}
