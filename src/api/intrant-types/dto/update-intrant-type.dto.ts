import { PartialType } from '@nestjs/mapped-types';
import { CreateIntrantTypeDto } from './create-intrant-type.dto';

export class UpdateIntrantTypeDto extends PartialType(CreateIntrantTypeDto) {}
