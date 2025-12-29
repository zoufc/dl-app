import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
  ValidateIf,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendMailDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  buttonText?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;
}

export class SendToUsersDto extends SendMailDto {
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  @ValidateIf((o) => !o.userIds || o.userIds.length === 0)
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => !o.emails || o.emails.length === 0)
  userIds?: string[];
}

export class SendToRoleDto extends SendMailDto {
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class RecipientsDto {
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @IsOptional()
  @IsBoolean()
  allDirectors?: boolean;

  @IsOptional()
  @IsBoolean()
  allResponsibles?: boolean;

  @IsOptional()
  @IsBoolean()
  allSuperAdmins?: boolean;

  @IsOptional()
  @IsBoolean()
  allLabAdmins?: boolean;

  @IsOptional()
  @IsBoolean()
  allRegionAdmins?: boolean;

  @IsOptional()
  @IsBoolean()
  allStaffs?: boolean;
}

export class SendMailWithRecipientsDto extends SendMailDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecipientsDto)
  recipients: RecipientsDto;
}
