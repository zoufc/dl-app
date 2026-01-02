import { IsNotEmpty, IsEmail, IsString, IsEnum } from 'class-validator';
import { OtpTypeEnum } from '../schemas/otp.schema';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}
