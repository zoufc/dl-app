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
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
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
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ALL INIT---`);
      const equipments = await this.equipmentsService.findAll();
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des équipements',
        data: equipments,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ONE INIT---`);
      const equipment = await this.equipmentsService.findOne(id);
      logger.info(`---EQUIPMENTS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Équipement ${id}`,
        data: equipment,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
    @Res() res,
  ) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.equipmentsService.update(
        id,
        updateEquipmentDto,
      );
      logger.info(`---EQUIPMENTS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Équipement ${id} mis à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---EQUIPMENTS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.equipmentsService.remove(id);
      logger.info(`---EQUIPMENTS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Équipement ${id} supprimé`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---EQUIPMENTS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }
}
