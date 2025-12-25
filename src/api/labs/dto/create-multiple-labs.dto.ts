import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLabDto } from './create-lab.dto';

export class CreateMultipleLabsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Au moins un laboratoire doit être fourni' })
  @ValidateNested({ each: true })
  @Type(() => CreateLabDto)
  labs: CreateLabDto[];
}
