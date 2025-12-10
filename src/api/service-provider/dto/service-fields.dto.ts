import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ServiceFieldType } from 'src/utils/enums/service_offer.enum';

export class ServiceFieldDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  type: string;

  @ValidateIf((o) => o.type === ServiceFieldType.DROPDOWN)
  @IsNotEmpty({
    message: 'les options du dropdown sont requis',
  })
  dropdownOptions: [any];
}
