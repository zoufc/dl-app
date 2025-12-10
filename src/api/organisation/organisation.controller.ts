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
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import logger from 'src/utils/logger';

@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post()
  async create(
    @Body() createOrganisationDto: CreateOrganisationDto,
    @Res() res,
  ) {
    try {
      logger.info(`---ORGANISATION.CONTROLLER.CREATE INIT---`);
      const organisation = await this.organisationService.create(
        createOrganisationDto,
      );
      logger.info(`---ORGANISATION.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Organisation créée avec succès',
        data: organisation,
      });
    } catch (error) {
      logger.error(`---ORGANISATION.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---ORGANISATION.CONTROLLER.FIND_ALL INIT---`);
      const organisations = await this.organisationService.findAll();
      logger.info(`---ORGANISATION.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des organisations',
        data: organisations,
      });
    } catch (error) {
      logger.error(`---ORGANISATION.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ORGANISATION.CONTROLLER.FIND_ONE INIT---`);
      const organisation = await this.organisationService.findOne(id);
      logger.info(`---ORGANISATION.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Organisation ${id}`,
        data: organisation,
      });
    } catch (error) {
      logger.error(`---ORGANISATION.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
    @Res() res,
  ) {
    try {
      logger.info(`---ORGANISATION.CONTROLLER.UPDATE INIT---`);
      const updated = await this.organisationService.update(
        id,
        updateOrganisationDto,
      );
      logger.info(`---ORGANISATION.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Organisation ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---ORGANISATION.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ORGANISATION.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.organisationService.remove(id);
      logger.info(`---ORGANISATION.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Organisation ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---ORGANISATION.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }
}
