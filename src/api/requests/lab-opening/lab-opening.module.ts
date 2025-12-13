import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabOpeningService } from './lab-opening.service';
import { LabOpeningController } from './lab-opening.controller';
import { RequestSchema } from '../schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
  ],
  controllers: [LabOpeningController],
  providers: [LabOpeningService],
  exports: [LabOpeningService],
})
export class LabOpeningModule {}
