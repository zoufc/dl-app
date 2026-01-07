import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentOrderDto } from './create-equipment-order.dto';

export class UpdateEquipmentOrderDto extends PartialType(
  CreateEquipmentOrderDto,
) {}
