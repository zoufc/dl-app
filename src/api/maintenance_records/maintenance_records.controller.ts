import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { MaintenanceRecordsService } from './maintenance_records.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance_record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance_record.dto';
import logger from 'src/utils/logger';

@Controller('maintenance-records')
export class MaintenanceRecordsController {
  constructor(private readonly maintenanceRecordsService: MaintenanceRecordsService) {}

  @Post()
  async create(@Body() createMaintenanceRecordDto: CreateMaintenanceRecordDto, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.CREATE INIT---`);
      const maintenanceRecord = await this.maintenanceRecordsService.create(createMaintenanceRecordDto);
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Enregistrement de maintenance créé avec succès',
        data: maintenanceRecord
      });
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ALL INIT---`);
      const maintenanceRecords = await this.maintenanceRecordsService.findAll();
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des enregistrements de maintenance',
        data: maintenanceRecords
      });
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ONE INIT---`);
      const maintenanceRecord = await this.maintenanceRecordsService.findOne(id);
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Enregistrement de maintenance ${id}`,
        data: maintenanceRecord
      });
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMaintenanceRecordDto: UpdateMaintenanceRecordDto, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.maintenanceRecordsService.update(id, updateMaintenanceRecordDto);
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Enregistrement de maintenance ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.maintenanceRecordsService.remove(id);
      logger.info(`---MAINTENANCE_RECORDS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Enregistrement de maintenance ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
