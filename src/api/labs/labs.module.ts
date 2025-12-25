import { Module } from '@nestjs/common';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LabSchema } from './schemas/lab.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Lab', schema: LabSchema }])],
  controllers: [LabsController],
  providers: [LabsService],
})
export class LabsModule {}
