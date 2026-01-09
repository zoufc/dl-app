import { IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class FindIntrantDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsMongoId()
  type?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
