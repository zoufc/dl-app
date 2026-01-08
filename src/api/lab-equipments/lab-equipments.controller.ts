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
  Req,
  HttpStatus,
} from '@nestjs/common';
import { LabEquipmentsService } from './lab-equipments.service';
import { CreateLabEquipmentDto } from './dto/create-lab-equipment.dto';
import { UpdateLabEquipmentDto } from './dto/update-lab-equipment.dto';
import { FindLabEquipmentDto } from './dto/find-lab-equipment.dto';
import logger from 'src/utils/logger';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';

@Controller('lab-equipments')
export class LabEquipmentsController {
  constructor(private readonly labEquipmentsService: LabEquipmentsService) {}

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Post()
  async create(
    @Body() createLabEquipmentDto: CreateLabEquipmentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.CREATE INIT---`);
      const userId = req.user._id;
      const labEquipment = await this.labEquipmentsService.create(
        createLabEquipmentDto,
        userId,
      );
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Équipement du labo créé avec succès',
        data: labEquipment,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get()
  async findAll(@Query() query: FindLabEquipmentDto, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.labEquipmentsService.findAll(query);
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des équipements du labo',
        ...result,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const labEquipment = await this.labEquipmentsService.findOne(id);
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement du labo récupéré avec succès',
        data: labEquipment,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLabEquipmentDto: UpdateLabEquipmentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.UPDATE INIT--- id=${id}`);
      const user = req.user;
      const updated = await this.labEquipmentsService.update(
        id,
        updateLabEquipmentDto,
        user,
      );
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement du labo mis à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.labEquipmentsService.remove(id);
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement du labo supprimé avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Patch(':id/receive')
  async receive(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.RECEIVE INIT--- id=${id}`);
      const userId = req.user._id;
      const updated = await this.labEquipmentsService.receive(id, userId);
      logger.info(`---LAB_EQUIPMENTS.CONTROLLER.RECEIVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Équipement reçu et marqué comme disponible',
        data: updated,
      });
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.CONTROLLER.RECEIVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
