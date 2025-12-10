import { PartialType } from '@nestjs/mapped-types';
import { CreateStructureLevelDto } from './create-structure-level.dto';

export class UpdateStructureLevelDto extends PartialType(CreateStructureLevelDto) {}
