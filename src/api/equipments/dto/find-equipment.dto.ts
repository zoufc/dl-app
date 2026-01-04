import {
  IsOptional,
  IsArray,
  IsMongoId,
  IsString,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EquipmentStatusEnum } from './create-equipment.dto';

export class FindEquipmentDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  supplier?: string;

  @IsOptional()
  @IsMongoId()
  equipmentType?: string;

  @IsOptional()
  @IsEnum(EquipmentStatusEnum)
  status?: EquipmentStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
