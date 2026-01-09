import { Module } from '@nestjs/common';
import { IntrantStocksService } from './intrant-stocks.service';
import { IntrantStocksController } from './intrant-stocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IntrantStockSchema } from './schemas/intrant-stock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IntrantStock', schema: IntrantStockSchema },
    ]),
  ],
  controllers: [IntrantStocksController],
  providers: [IntrantStocksService],
  exports: [IntrantStocksService],
})
export class IntrantStocksModule {}

