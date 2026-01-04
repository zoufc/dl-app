import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentTypesService } from './equipment_types.service';
import { EquipmentTypesController } from './equipment_types.controller';
import { EquipmentTypeSchema } from './schemas/equipment_type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EquipmentType', schema: EquipmentTypeSchema },
    ]),
  ],
  controllers: [EquipmentTypesController],
  providers: [EquipmentTypesService],
  exports: [EquipmentTypesService, MongooseModule],
})
export class EquipmentTypesModule {}
