import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsJobService } from './alerts-job.service';
import { AlertSchema } from 'src/api/alerts/schemas/alert.schema';
import { MaintenanceScheduleSchema } from 'src/api/maintenance_schedules/schemas/maintenance_schedule.schema';
import { EquipmentSchema } from 'src/api/equipments/schemas/equipment.schema';
import { MailModule } from 'src/providers/mail-service/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Alert', schema: AlertSchema },
      { name: 'MaintenanceSchedule', schema: MaintenanceScheduleSchema },
      { name: 'Equipment', schema: EquipmentSchema },
    ]),
    MailModule,
  ],
  providers: [AlertsJobService],
  exports: [AlertsJobService],
})
export class AlertsJobModule {}
