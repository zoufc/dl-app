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
import { StaffLevelService } from './staff-level.service';
import { CreateStaffLevelDto } from './dto/create-staff-level.dto';
import { UpdateStaffLevelDto } from './dto/update-staff-level.dto';
import { FindStaffLevelDto } from './dto/find-staff-level.dto';
import logger from 'src/utils/logger';

@Controller('staff-levels')
export class StaffLevelController {
  constructor(private readonly staffLevelService: StaffLevelService) {}

  @Post()
  async create(@Body() createStaffLevelDto: CreateStaffLevelDto, @Res() res) {
    try {
      logger.info(`---STAFF_LEVEL.CONTROLLER.CREATE INIT---`);
      const staffLevel = await this.staffLevelService.create(
        createStaffLevelDto,
      );
      logger.info(`---STAFF_LEVEL.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Niveau de personnel créé avec succès',
        data: staffLevel,
      });
    } catch (error) {
      logger.error(`---STAFF_LEVEL.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Query() query: FindStaffLevelDto, @Res() res) {
    try {
      logger.info(`---STAFF_LEVEL.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.staffLevelService.findAll(query);
      logger.info(`---STAFF_LEVEL.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des niveaux de personnel',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(`---STAFF_LEVEL.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---STAFF_LEVEL.CONTROLLER.FIND_ONE INIT---`);
      const staffLevel = await this.staffLevelService.findOne(id);
      logger.info(`---STAFF_LEVEL.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Niveau de personnel ${id}`,
        data: staffLevel,
      });
    } catch (error) {
      logger.error(`---STAFF_LEVEL.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffLevelDto: UpdateStaffLevelDto,
    @Res() res,
  ) {
    try {
      logger.info(`---STAFF_LEVEL.CONTROLLER.UPDATE INIT---`);
      const updated = await this.staffLevelService.update(
        id,
        updateStaffLevelDto,
      );
      logger.info(`---STAFF_LEVEL.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Niveau de personnel ${id} mis à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---STAFF_LEVEL.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---STAFF_LEVEL.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.staffLevelService.remove(id);
      logger.info(`---STAFF_LEVEL.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Niveau de personnel ${id} supprimé`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---STAFF_LEVEL.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
