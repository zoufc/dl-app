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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import logger from 'src/utils/logger';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto, @Res() res) {
    try {
      logger.info(`---LOCATIONS.CONTROLLER.CREATE INIT---`);
      const location = await this.locationsService.create(createLocationDto);
      logger.info(`---LOCATIONS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Localisation créée avec succès',
        data: location,
      });
    } catch (error) {
      logger.error(`---LOCATIONS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---LOCATIONS.CONTROLLER.FIND_ALL INIT---`);
      const locations = await this.locationsService.findAll();
      logger.info(`---LOCATIONS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des localisations',
        data: locations,
      });
    } catch (error) {
      logger.error(`---LOCATIONS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LOCATIONS.CONTROLLER.FIND_ONE INIT---`);
      const location = await this.locationsService.findOne(id);
      logger.info(`---LOCATIONS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Localisation ${id}`,
        data: location,
      });
    } catch (error) {
      logger.error(`---LOCATIONS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Res() res,
  ) {
    try {
      logger.info(`---LOCATIONS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.locationsService.update(id, updateLocationDto);
      logger.info(`---LOCATIONS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Localisation ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---LOCATIONS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LOCATIONS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.locationsService.remove(id);
      logger.info(`---LOCATIONS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Localisation ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---LOCATIONS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
