import { Module } from '@nestjs/common';
import { PlatformSettingsService } from './platform-settings.service';
import { PlatformSettingsController } from './platform-settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformSettingsSchema } from './schemas/platform-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PlatformSettings', schema: PlatformSettingsSchema },
    ]),
  ],
  controllers: [PlatformSettingsController],
  providers: [PlatformSettingsService],
  exports: [PlatformSettingsService],
})
export class PlatformSettingsModule {}
