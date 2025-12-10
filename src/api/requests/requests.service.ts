import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './entities/request.entity';
import logger from 'src/utils/logger';

@Injectable()
export class RequestsService {
  constructor(@InjectModel('Request') private requestModel: Model<Request>) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      logger.info(`---REQUESTS.SERVICE.CREATE INIT---`);
      const request = await this.requestModel.create(createRequestDto);
      await request.populate('user', 'firstname lastname email');
      logger.info(`---REQUESTS.SERVICE.CREATE SUCCESS---`);
      return request;
    } catch (error) {
      logger.error(`---REQUESTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---REQUESTS.SERVICE.FIND_ALL INIT---`);
      const requests = await this.requestModel
        .find()
        .populate('user', 'firstname lastname email')
        .sort({ created_at: -1 })
        .exec();
      logger.info(`---REQUESTS.SERVICE.FIND_ALL SUCCESS---`);
      return requests;
    } catch (error) {
      logger.error(`---REQUESTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---REQUESTS.SERVICE.FIND_ONE INIT---`);
      const request = await this.requestModel
        .findById(id)
        .populate('user', 'firstname lastname email')
        .exec();
      if (!request) {
        throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REQUESTS.SERVICE.FIND_ONE SUCCESS---`);
      return request;
    } catch (error) {
      logger.error(`---REQUESTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    try {
      logger.info(`---REQUESTS.SERVICE.UPDATE INIT---`);
      const updated = await this.requestModel
        .findByIdAndUpdate(
          id,
          { ...updateRequestDto, updated_at: new Date() },
          { new: true },
        )
        .populate('user', 'firstname lastname email')
        .exec();
      if (!updated) {
        throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REQUESTS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---REQUESTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---REQUESTS.SERVICE.REMOVE INIT---`);
      const deleted = await this.requestModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REQUESTS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---REQUESTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
