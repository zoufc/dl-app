import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabEquipmentStocksService } from './lab-equipment-stocks.service';
import { LabEquipmentStocksController } from './lab-equipment-stocks.controller';
import { LabEquipmentStockSchema } from './schemas/lab-equipment-stock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LabEquipmentStock', schema: LabEquipmentStockSchema },
    ]),
  ],
  controllers: [LabEquipmentStocksController],
  providers: [LabEquipmentStocksService],
  exports: [LabEquipmentStocksService, MongooseModule],
})
export class LabEquipmentStocksModule {}
