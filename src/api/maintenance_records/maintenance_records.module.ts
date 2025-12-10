import { Module } from '@nestjs/common';
import { MaintenanceRecordsService } from './maintenance_records.service';
import { MaintenanceRecordsController } from './maintenance_records.controller';

@Module({
  controllers: [MaintenanceRecordsController],
  providers: [MaintenanceRecordsService],
})
export class MaintenanceRecordsModule {}
