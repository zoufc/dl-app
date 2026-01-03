import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SdrController } from './sdr.controller';
import { SdrService } from './sdr.service';
import { SdrSchema } from './schemas/sdr.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sdr', schema: SdrSchema }]),
    UserModule,
  ],
  controllers: [SdrController],
  providers: [SdrService],
  exports: [SdrService],
})
export class SdrModule {}
