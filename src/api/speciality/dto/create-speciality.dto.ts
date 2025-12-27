import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSpecialityDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
