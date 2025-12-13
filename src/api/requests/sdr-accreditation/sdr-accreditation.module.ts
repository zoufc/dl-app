import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SdrAccreditationService } from './sdr-accreditation.service';
import { SdrAccreditationController } from './sdr-accreditation.controller';
import { RequestSchema } from '../schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
  ],
  controllers: [SdrAccreditationController],
  providers: [SdrAccreditationService],
  exports: [SdrAccreditationService],
})
export class SdrAccreditationModule {}
