import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Document } from '../../interfaces/document.interface';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';
import { AmmImportRequestTypeEnum } from 'src/utils/enums/amm-import-request-type.enum';

export class CreateAmmImportDto {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum;

  @IsNotEmpty()
  @IsString()
  applicantName: string;

  @IsNotEmpty()
  @IsEmail()
  applicantEmail: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  reagentName: string;

  @IsNotEmpty()
  @IsEnum(AmmImportRequestTypeEnum)
  requestType: AmmImportRequestTypeEnum;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  administrativeDocuments?: Document[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  technicalDocuments?: Document[];

  @IsNotEmpty({ message: 'complianceAttestation est requis' })
  @Transform(({ value }) => {
    // Accepter boolean true directement
    if (value === true) return true;
    // Accepter string "true" (insensible à la casse) et le convertir en boolean
    if (typeof value === 'string' && value.toLowerCase().trim() === 'true')
      return true;
    // Pour tout le reste (false, "false", etc.), retourner false (sera rejeté)
    return false;
  })
  @IsBoolean({ message: 'complianceAttestation doit être true ou "true"' })
  @IsIn([true], { message: 'complianceAttestation doit être true' })
  complianceAttestation: boolean;
}
