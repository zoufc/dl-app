import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert } from './entities/alert.entity';
import logger from 'src/utils/logger';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel('Alert') private alertModel: Model<Alert>,
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    try {
      logger.info(`---ALERTS.SERVICE.CREATE INIT---`);
      const alert = await this.alertModel.create(createAlertDto);
      logger.info(`---ALERTS.SERVICE.CREATE SUCCESS---`);
      return alert;
    } catch (error) {
      logger.error(`---ALERTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      logger.info(`---ALERTS.SERVICE.FIND_ALL INIT---`);
      const alerts = await this.alertModel.find().sort({ created_at: -1 }).exec();
      logger.info(`---ALERTS.SERVICE.FIND_ALL SUCCESS---`);
      return alerts;
    } catch (error) {
      logger.error(`---ALERTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---ALERTS.SERVICE.FIND_ONE INIT---`);
      const alert = await this.alertModel.findById(id).exec();
      if (!alert) {
        throw new HttpException('Alerte non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ALERTS.SERVICE.FIND_ONE SUCCESS---`);
      return alert;
    } catch (error) {
      logger.error(`---ALERTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateAlertDto: UpdateAlertDto) {
    try {
      logger.info(`---ALERTS.SERVICE.UPDATE INIT---`);
      const updated = await this.alertModel.findByIdAndUpdate(
        id,
        { ...updateAlertDto, updated_at: new Date() },
        { new: true }
      ).exec();
      if (!updated) {
        throw new HttpException('Alerte non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ALERTS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---ALERTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---ALERTS.SERVICE.REMOVE INIT---`);
      const deleted = await this.alertModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Alerte non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ALERTS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---ALERTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
