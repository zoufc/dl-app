import { IsOptional, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindLabEquipmentStockDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  equipment?: string;
}
