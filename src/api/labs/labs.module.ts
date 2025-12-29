import { Module } from '@nestjs/common';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LabSchema } from './schemas/lab.schema';
import { StructureSchema } from 'src/api/structure/schemas/structure.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lab', schema: LabSchema },
      { name: 'Structure', schema: StructureSchema },
    ]),
  ],
  controllers: [LabsController],
  providers: [LabsService],
})
export class LabsModule {}
