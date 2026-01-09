import { PartialType } from '@nestjs/mapped-types';
import { CreateIntrantStockDto } from './create-intrant-stock.dto';

export class UpdateIntrantStockDto extends PartialType(CreateIntrantStockDto) {}
