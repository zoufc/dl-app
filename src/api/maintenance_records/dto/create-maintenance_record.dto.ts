import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import {
  MaintenanceType,
  MaintenanceStatus,
} from '../schemas/maintenance_record.schema';

export class CreateMaintenanceRecordDto {
  @IsNotEmpty()
  @IsMongoId()
  equipment: string;

  @IsNotEmpty()
  @IsEnum(MaintenanceType)
  maintenanceType: MaintenanceType;

  @IsNotEmpty()
  @IsMongoId()
  technician: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
