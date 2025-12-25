import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { UserSchema } from '../user/schemas/user.schema';
import { LabSchema } from '../labs/schemas/lab.schema';
import { MailModule } from 'src/providers/mail-service/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Lab', schema: LabSchema },
    ]),
    MailModule,
  ],
  controllers: [MailingController],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
