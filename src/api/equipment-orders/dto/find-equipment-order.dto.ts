import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum } from '../schemas/equipment-order.schema';

export class FindEquipmentOrderDto {
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
  supplier?: string;

  @IsOptional()
  @IsMongoId()
  equipment?: string;

  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsMongoId()
  validatedBy?: string;

  @IsOptional()
  @IsMongoId()
  completedBy?: string;
}
