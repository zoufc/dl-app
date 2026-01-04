import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentsService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';
import { EquipmentSchema } from './schemas/equipment.schema';
import { LabSchema } from '../labs/schemas/lab.schema';
import { SupplierSchema } from '../suppliers/schemas/supplier.schema';
import { EquipmentTypeSchema } from '../equipment_types/schemas/equipment_type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Equipment', schema: EquipmentSchema }]),
  ],
  controllers: [EquipmentsController],
  providers: [EquipmentsService],
  exports: [EquipmentsService],
})
export class EquipmentsModule {}
