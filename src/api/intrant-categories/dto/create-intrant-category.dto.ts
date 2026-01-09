import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIntrantCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
