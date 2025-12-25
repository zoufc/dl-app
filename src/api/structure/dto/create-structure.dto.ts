import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStructureDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  type: string;

  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  department: string;

  @IsNotEmpty()
  district: string;

  @IsOptional()
  level: string;
}
