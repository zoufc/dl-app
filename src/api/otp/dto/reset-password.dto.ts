import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { OtpTypeEnum } from '../schemas/otp.schema';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}
