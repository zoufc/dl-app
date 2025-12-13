import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Document } from '../../interfaces/document.interface';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';
import { SdrAccreditationQualificationEnum } from 'src/utils/enums/sdr-accreditation-qualification.enum';

export class CreateSdrAccreditationDto {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @IsNotEmpty()
  @IsString()
  technicalManagerName: string;

  @IsNotEmpty()
  @IsEmail()
  technicalManagerEmail: string;

  @IsNotEmpty()
  @IsEnum(SdrAccreditationQualificationEnum)
  technicalManagerQualification: SdrAccreditationQualificationEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  companyDocuments?: Document[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  technicalManagerDocuments?: Document[];

  @IsNotEmpty()
  @IsBoolean()
  complianceDeclaration: boolean;
}
