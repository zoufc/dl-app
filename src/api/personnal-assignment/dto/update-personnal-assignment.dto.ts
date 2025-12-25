import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonnalAssignmentDto } from './create-personnal-assignment.dto';

export class UpdatePersonnalAssignmentDto extends PartialType(CreatePersonnalAssignmentDto) {}
