import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import logger from 'src/utils/logger';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @Res() res) {
    try {
      logger.info(`---REQUESTS.CONTROLLER.CREATE INIT---`);
      const request = await this.requestsService.create(createRequestDto);
      logger.info(`---REQUESTS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Demande créée avec succès',
        data: request
      });
    } catch (error) {
      logger.error(`---REQUESTS.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---REQUESTS.CONTROLLER.FIND_ALL INIT---`);
      const requests = await this.requestsService.findAll();
      logger.info(`---REQUESTS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des demandes',
        data: requests
      });
    } catch (error) {
      logger.error(`---REQUESTS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---REQUESTS.CONTROLLER.FIND_ONE INIT---`);
      const request = await this.requestsService.findOne(id);
      logger.info(`---REQUESTS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Demande ${id}`,
        data: request
      });
    } catch (error) {
      logger.error(`---REQUESTS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @Res() res) {
    try {
      logger.info(`---REQUESTS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.requestsService.update(id, updateRequestDto);
      logger.info(`---REQUESTS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Demande ${id} mise à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---REQUESTS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---REQUESTS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.requestsService.remove(id);
      logger.info(`---REQUESTS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Demande ${id} supprimée`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---REQUESTS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
