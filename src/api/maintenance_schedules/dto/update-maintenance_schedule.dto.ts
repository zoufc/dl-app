import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceScheduleDto } from './create-maintenance_schedule.dto';

export class UpdateMaintenanceScheduleDto extends PartialType(CreateMaintenanceScheduleDto) {}
