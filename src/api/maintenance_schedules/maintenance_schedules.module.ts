import { Module } from '@nestjs/common';
import { MaintenanceSchedulesService } from './maintenance_schedules.service';
import { MaintenanceSchedulesController } from './maintenance_schedules.controller';

@Module({
  controllers: [MaintenanceSchedulesController],
  providers: [MaintenanceSchedulesService],
})
export class MaintenanceSchedulesModule {}
