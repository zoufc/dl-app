import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ScheduleFrequency } from '../schemas/maintenance_schedule.schema';
import { MaintenanceType } from '../../maintenance_records/schemas/maintenance_record.schema';

export class CreateMaintenanceScheduleDto {
  @IsNotEmpty()
  @IsMongoId()
  equipment: string;

  @IsNotEmpty()
  @IsEnum(MaintenanceType)
  maintenanceType: MaintenanceType;

  @IsNotEmpty()
  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: Date;

  @IsNotEmpty()
  @IsDateString()
  nextMaintenanceDate: Date;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
