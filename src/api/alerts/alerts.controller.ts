import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import logger from 'src/utils/logger';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() createAlertDto: CreateAlertDto, @Res() res) {
    try {
      logger.info(`---ALERTS.CONTROLLER.CREATE INIT---`);
      const alert = await this.alertsService.create(createAlertDto);
      logger.info(`---ALERTS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Alerte créée avec succès',
        data: alert,
      });
    } catch (error) {
      logger.error(`---ALERTS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---ALERTS.CONTROLLER.FIND_ALL INIT---`);
      const alerts = await this.alertsService.findAll();
      logger.info(`---ALERTS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des alertes',
        data: alerts,
      });
    } catch (error) {
      logger.error(`---ALERTS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ALERTS.CONTROLLER.FIND_ONE INIT---`);
      const alert = await this.alertsService.findOne(id);
      logger.info(`---ALERTS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Alerte ${id}`,
        data: alert,
      });
    } catch (error) {
      logger.error(`---ALERTS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
    @Res() res,
  ) {
    try {
      logger.info(`---ALERTS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.alertsService.update(id, updateAlertDto);
      logger.info(`---ALERTS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Alerte ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---ALERTS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ALERTS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.alertsService.remove(id);
      logger.info(`---ALERTS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Alerte ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---ALERTS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
