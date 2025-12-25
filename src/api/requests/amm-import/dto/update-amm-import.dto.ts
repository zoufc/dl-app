import { PartialType } from '@nestjs/mapped-types';
import { CreateAmmImportDto } from './create-amm-import.dto';

export class UpdateAmmImportDto extends PartialType(CreateAmmImportDto) {}
