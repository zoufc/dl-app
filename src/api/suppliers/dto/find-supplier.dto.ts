import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { SupplierStatusEnum } from './create-supplier.dto';

export class FindSupplierDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsEnum(SupplierStatusEnum)
  status?: SupplierStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
