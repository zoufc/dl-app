import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CanalEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export class MessageRecipientsDto {
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

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

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(CanalEnum)
  canal: CanalEnum;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MessageRecipientsDto)
  recipients: MessageRecipientsDto;
}
