import { IsOptional, IsMongoId, IsEnum, IsString } from 'class-validator';
import { IntrantOrderStatusEnum } from '../schemas/intrant-order.schema';

export class FindIntrantOrderDto {
  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  intrant?: string;

  @IsOptional()
  @IsMongoId()
  supplier?: string;

  @IsOptional()
  @IsEnum(IntrantOrderStatusEnum)
  status?: IntrantOrderStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
