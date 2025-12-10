import { Module } from '@nestjs/common';
import { StructureLevelService } from './structure-level.service';
import { StructureLevelController } from './structure-level.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StructureLevelSchema } from './schemas/strucure-level.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"StructureLevel",schema:StructureLevelSchema}])],
  controllers: [StructureLevelController],
  providers: [StructureLevelService],
})
export class StructureLevelModule {}
