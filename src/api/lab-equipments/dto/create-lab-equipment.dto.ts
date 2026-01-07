import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import {
  LabEquipmentStatus,
  LabInventoryStatus,
} from '../schemas/lab-equipment.schema';

export class CreateLabEquipmentDto {
  @IsNotEmpty()
  @IsMongoId()
  lab: string;

  @IsNotEmpty()
  @IsMongoId()
  equipment: string;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(LabEquipmentStatus)
  status?: LabEquipmentStatus;

  @IsOptional()
  @IsEnum(LabInventoryStatus)
  inventoryStatus?: LabInventoryStatus;

  @IsOptional()
  @IsDateString()
  warrantyExpiryDate?: Date;

  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: Date;

  @IsOptional()
  @IsDateString()
  nextMaintenanceDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
