import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffLevelDto } from './create-staff-level.dto';

export class UpdateStaffLevelDto extends PartialType(CreateStaffLevelDto) {}
