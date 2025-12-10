import { IsNotEmpty } from 'class-validator';

export class CreatePlatformSettingDto {
  @IsNotEmpty()
  platformCommissionPercent: number;

  @IsNotEmpty()
  mobileMoneyCommissionPercent: number;

  @IsNotEmpty()
  lenderCommissionPercent: number;

  @IsNotEmpty()
  minimumTransferAmount: number;

  @IsNotEmpty()
  maximumTransferAmount: number;

  @IsNotEmpty()
  maxDailyTransfers: number;

  supportPhone: string;
  updatedAt: Date;
}
