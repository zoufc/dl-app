import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEquipmentTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
