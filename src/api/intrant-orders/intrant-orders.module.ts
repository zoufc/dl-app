import { Module } from '@nestjs/common';
import { IntrantOrdersService } from './intrant-orders.service';
import { IntrantOrdersController } from './intrant-orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IntrantOrderSchema } from './schemas/intrant-order.schema';
import { IntrantStocksModule } from '../intrant-stocks/intrant-stocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IntrantOrder', schema: IntrantOrderSchema },
    ]),
    IntrantStocksModule,
  ],
  controllers: [IntrantOrdersController],
  providers: [IntrantOrdersService],
  exports: [IntrantOrdersService],
})
export class IntrantOrdersModule {}

