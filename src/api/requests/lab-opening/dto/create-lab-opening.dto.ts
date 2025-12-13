import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Document } from '../../interfaces/document.interface';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';
import { LabOpeningRequestStepEnum } from 'src/utils/enums/lab-opening-request-step.enum';

export class CreateLabOpeningDto {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum;

  @IsNotEmpty()
  @IsEnum(LabOpeningRequestStepEnum)
  requestStep: LabOpeningRequestStepEnum;

  @IsNotEmpty()
  @IsString()
  applicantName: string;

  @IsNotEmpty()
  @IsEmail()
  applicantEmail: string;

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
}
