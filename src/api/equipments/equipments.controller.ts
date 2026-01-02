import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { FindEquipmentDto } from './dto/find-equipment.dto';
import logger from 'src/utils/logger';

@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  async create(@Body() createEquipmentDto: CreateEquipmentDto, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.CREATE INIT---`);
      const equipment = await this.equipmentsService.create(createEquipmentDto);
      logger.info(`---EQUIPMENTS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Équipement créé avec succès',
        data: equipment,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get()
  async findAll(@Query() query: FindEquipmentDto, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.equipmentsService.findAll(query);
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des équipements',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const equipment = await this.equipmentsService.findOne(id);
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement récupéré avec succès',
        data: equipment,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
    @Res() res,
  ) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.equipmentsService.update(
        id,
        updateEquipmentDto,
      );
      logger.info(`---EQUIPMENTS.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement mis à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.equipmentsService.remove(id);
      logger.info(`---EQUIPMENTS.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement supprimé avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
