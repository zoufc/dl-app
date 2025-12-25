import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './schemas/request.schema';
import { AmmImportModule } from './amm-import/amm-import.module';
import { LabOpeningModule } from './lab-opening/lab-opening.module';
import { SdrAccreditationModule } from './sdr-accreditation/sdr-accreditation.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    AmmImportModule,
    LabOpeningModule,
    SdrAccreditationModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [AmmImportModule, LabOpeningModule, SdrAccreditationModule],
})
export class RequestsModule {}
