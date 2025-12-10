import { Module } from '@nestjs/common';
import { InventoryTransactionsService } from './inventory_transactions.service';
import { InventoryTransactionsController } from './inventory_transactions.controller';

@Module({
  controllers: [InventoryTransactionsController],
  providers: [InventoryTransactionsService],
})
export class InventoryTransactionsModule {}
