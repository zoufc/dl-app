import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabEquipmentsService } from './lab-equipments.service';
import { LabEquipmentsController } from './lab-equipments.controller';
import { LabEquipmentSchema } from './schemas/lab-equipment.schema';
import { LabEquipmentStockSchema } from '../lab-equipment-stocks/schemas/lab-equipment-stock.schema';
import { EquipmentSchema } from '../equipments/schemas/equipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LabEquipment', schema: LabEquipmentSchema },
      { name: 'LabEquipmentStock', schema: LabEquipmentStockSchema },
      { name: 'Equipment', schema: EquipmentSchema },
    ]),
  ],
  controllers: [LabEquipmentsController],
  providers: [LabEquipmentsService],
  exports: [LabEquipmentsService],
})
export class LabEquipmentsModule {}
