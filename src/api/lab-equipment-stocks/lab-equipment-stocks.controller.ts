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
import { LabEquipmentStocksService } from './lab-equipment-stocks.service';
import { CreateLabEquipmentStockDto } from './dto/create-lab-equipment-stock.dto';
import { UpdateLabEquipmentStockDto } from './dto/update-lab-equipment-stock.dto';
import { FindLabEquipmentStockDto } from './dto/find-lab-equipment-stock.dto';
import logger from 'src/utils/logger';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';

@Controller('lab-equipment-stocks')
export class LabEquipmentStocksController {
  constructor(
    private readonly labEquipmentStocksService: LabEquipmentStocksService,
  ) {}

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Post()
  async create(
    @Body() createLabEquipmentStockDto: CreateLabEquipmentStockDto,
    @Res() res,
  ) {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.CREATE INIT---`);
      const stock = await this.labEquipmentStocksService.create(
        createLabEquipmentStockDto,
      );
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Stock créé avec succès',
        data: stock,
      });
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.CREATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get()
  async findAll(@Query() query: FindLabEquipmentStockDto, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.labEquipmentStocksService.findAll(query);
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des stocks',
        ...result,
      });
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ALL ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ONE INIT--- id=${id}`,
      );
      const stock = await this.labEquipmentStocksService.findOne(id);
      logger.info(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Stock récupéré avec succès',
        data: stock,
      });
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.FIND_ONE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLabEquipmentStockDto: UpdateLabEquipmentStockDto,
    @Res() res,
  ) {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.labEquipmentStocksService.update(
        id,
        updateLabEquipmentStockDto,
      );
      logger.info(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.UPDATE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Stock mis à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.UPDATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.labEquipmentStocksService.remove(id);
      logger.info(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.REMOVE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Stock supprimé avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.CONTROLLER.REMOVE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
