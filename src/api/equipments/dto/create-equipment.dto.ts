import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateEquipmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  equipmentType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
