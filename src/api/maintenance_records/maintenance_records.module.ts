import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceRecordsService } from './maintenance_records.service';
import { MaintenanceRecordsController } from './maintenance_records.controller';
import { MaintenanceRecordSchema } from './schemas/maintenance_record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceRecord', schema: MaintenanceRecordSchema },
    ]),
  ],
  controllers: [MaintenanceRecordsController],
  providers: [MaintenanceRecordsService],
  exports: [MaintenanceRecordsService],
})
export class MaintenanceRecordsModule {}
