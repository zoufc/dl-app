import { Module } from '@nestjs/common';
import { IntrantTypesService } from './intrant-types.service';
import { IntrantTypesController } from './intrant-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IntrantTypeSchema } from './schemas/intrant-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IntrantType', schema: IntrantTypeSchema },
    ]),
  ],
  controllers: [IntrantTypesController],
  providers: [IntrantTypesService],
  exports: [IntrantTypesService],
})
export class IntrantTypesModule {}
