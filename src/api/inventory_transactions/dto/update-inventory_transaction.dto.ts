import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryTransactionDto } from './create-inventory_transaction.dto';

export class UpdateInventoryTransactionDto extends PartialType(CreateInventoryTransactionDto) {}
