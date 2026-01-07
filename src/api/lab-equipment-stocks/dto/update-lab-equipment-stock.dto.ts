import { PartialType } from '@nestjs/mapped-types';
import { CreateLabEquipmentStockDto } from './create-lab-equipment-stock.dto';

export class UpdateLabEquipmentStockDto extends PartialType(
  CreateLabEquipmentStockDto,
) {}
