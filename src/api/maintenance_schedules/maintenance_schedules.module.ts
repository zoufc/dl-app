import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceSchedulesService } from './maintenance_schedules.service';
import { MaintenanceSchedulesController } from './maintenance_schedules.controller';
import { MaintenanceScheduleSchema } from './schemas/maintenance_schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceSchedule', schema: MaintenanceScheduleSchema },
    ]),
  ],
  controllers: [MaintenanceSchedulesController],
  providers: [MaintenanceSchedulesService],
  exports: [MaintenanceSchedulesService],
})
export class MaintenanceSchedulesModule {}
