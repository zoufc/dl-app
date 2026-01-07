import { IsOptional, IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindEquipmentDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsMongoId()
  equipmentType?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
