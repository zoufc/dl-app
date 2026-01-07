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
  Query,
} from '@nestjs/common';
import { MaintenanceSchedulesService } from './maintenance_schedules.service';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance_schedule.dto';
import { UpdateMaintenanceScheduleDto } from './dto/update-maintenance_schedule.dto';
import { FindMaintenanceScheduleDto } from './dto/find-maintenance_schedule.dto';
import logger from 'src/utils/logger';

@Controller('maintenance-schedules')
export class MaintenanceSchedulesController {
  constructor(
    private readonly maintenanceSchedulesService: MaintenanceSchedulesService,
  ) {}

  @Post()
  async create(
    @Body() createMaintenanceScheduleDto: CreateMaintenanceScheduleDto,
    @Res() res,
  ) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.CREATE INIT---`);
      const maintenanceSchedule = await this.maintenanceSchedulesService.create(
        createMaintenanceScheduleDto,
      );
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Planning de maintenance créé avec succès',
        data: maintenanceSchedule,
      });
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.CONTROLLER.CREATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Query() query: FindMaintenanceScheduleDto, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.maintenanceSchedulesService.findAll(query);
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des plannings de maintenance',
        ...result,
      });
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ALL ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ONE INIT---`);
      const maintenanceSchedule =
        await this.maintenanceSchedulesService.findOne(id);
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Planning de maintenance ${id}`,
        data: maintenanceSchedule,
      });
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.CONTROLLER.FIND_ONE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMaintenanceScheduleDto: UpdateMaintenanceScheduleDto,
    @Res() res,
  ) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.UPDATE INIT---`);
      const updated = await this.maintenanceSchedulesService.update(
        id,
        updateMaintenanceScheduleDto,
      );
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Planning de maintenance ${id} mis à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.CONTROLLER.UPDATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.maintenanceSchedulesService.remove(id);
      logger.info(`---MAINTENANCE_SCHEDULES.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Planning de maintenance ${id} supprimé`,
        data: deleted,
      });
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.CONTROLLER.REMOVE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
