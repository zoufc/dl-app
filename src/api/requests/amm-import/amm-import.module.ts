import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmmImportService } from './amm-import.service';
import { AmmImportController } from './amm-import.controller';
import { RequestSchema } from '../schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
  ],
  controllers: [AmmImportController],
  providers: [AmmImportService],
  exports: [AmmImportService],
})
export class AmmImportModule {}
