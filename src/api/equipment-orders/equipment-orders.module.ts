import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentOrdersService } from './equipment-orders.service';
import { EquipmentOrdersController } from './equipment-orders.controller';
import { EquipmentOrderSchema } from './schemas/equipment-order.schema';
import { EquipmentTypeSchema } from '../equipment_types/schemas/equipment_type.schema';
import { EquipmentSchema } from '../equipments/schemas/equipment.schema';
import { LabEquipmentStocksModule } from '../lab-equipment-stocks/lab-equipment-stocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EquipmentOrder', schema: EquipmentOrderSchema },
      { name: 'EquipmentType', schema: EquipmentTypeSchema },
      { name: 'Equipment', schema: EquipmentSchema },
    ]),
    LabEquipmentStocksModule,
  ],
  controllers: [EquipmentOrdersController],
  providers: [EquipmentOrdersService],
  exports: [EquipmentOrdersService, MongooseModule],
})
export class EquipmentOrdersModule {}
