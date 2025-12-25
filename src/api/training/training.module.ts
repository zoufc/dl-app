import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { TrainingSchema } from './schemas/training.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Training', schema: TrainingSchema }]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
