import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestCommentService } from './request-comment.service';
import { RequestCommentController } from './request-comment.controller';
import { RequestCommentSchema } from './schemas/request-comment.schema';
import { RequestSchema } from '../requests/schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RequestComment', schema: RequestCommentSchema },
      { name: 'Request', schema: RequestSchema },
    ]),
  ],
  controllers: [RequestCommentController],
  providers: [RequestCommentService],
  exports: [RequestCommentService],
})
export class RequestCommentModule {}
