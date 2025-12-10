import { Module } from '@nestjs/common';
import { EquipmentTypesService } from './equipment_types.service';
import { EquipmentTypesController } from './equipment_types.controller';

@Module({
  controllers: [EquipmentTypesController],
  providers: [EquipmentTypesService],
})
export class EquipmentTypesModule {}
