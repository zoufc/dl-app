import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceRecordDto } from './create-maintenance_record.dto';

export class UpdateMaintenanceRecordDto extends PartialType(CreateMaintenanceRecordDto) {}
