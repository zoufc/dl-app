import {
  IsOptional,
  IsMongoId,
  IsString,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LabEquipmentStatus,
  LabInventoryStatus,
} from '../schemas/lab-equipment.schema';

export class FindLabEquipmentDto {
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

  @IsOptional()
  @IsMongoId()
  equipmentType?: string;

  @IsOptional()
  @IsEnum(LabEquipmentStatus)
  status?: LabEquipmentStatus;

  @IsOptional()
  @IsEnum(LabInventoryStatus)
  inventoryStatus?: LabInventoryStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
