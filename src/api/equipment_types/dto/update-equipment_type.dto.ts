import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentTypeDto } from './create-equipment_type.dto';

export class UpdateEquipmentTypeDto extends PartialType(CreateEquipmentTypeDto) {}
