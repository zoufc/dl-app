/* eslint-disable prettier/prettier */
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import logger from 'src/utils/logger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadHelper } from 'src/utils/functions/upload-image.helper';
import { AddFieldsDto } from './dto/add-fields.dto';

@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private readonly thirdPartyServiceService: ServiceProviderService,
  ) {}

  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: UploadHelper.uploadDirectory,
      }),
    }),
  )
  @Post('create')
  async create(
    @Body() createServiceProviderDto: CreateServiceProviderDto,
    @Res() res,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    try {
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.CREATE INIT---`);
      const thirdParty = await this.thirdPartyServiceService.create(
        createServiceProviderDto,
        logo,
      );
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.CREATE SUCCESS---`);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Service provider créé', data: thirdParty });
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Get('findAll')
  async findAll(@Res() res) {
    try {
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.FIND_ALL INIT---`);
      const thirdParties = await this.thirdPartyServiceService.findAll();
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.FIND_ALL SUCCESS---`);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Listes des services providers', data: thirdParties });
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.FIND_ONE INIT---`);
      const serviceProvider = await this.thirdPartyServiceService.findOne(id);
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Service provider ${id}`,
        data: serviceProvider
      });
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceProviderDto: UpdateServiceProviderDto,
    @Res() res,
  ) {
    try {
      const updated = await this.thirdPartyServiceService.update(
        id,
        updateServiceProviderDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ messsage: 'Service mis à jour', data: updated });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Patch('/addFields/:id')
  async addFields(
    @Param('id') id: string,
    @Body() addFieldsDto: AddFieldsDto,
    @Res() res,
  ) {
    try {
      const updated = await this.thirdPartyServiceService.addFields(
        id,
        addFieldsDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ messsage: 'Service mis à jour', data: updated });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.thirdPartyServiceService.remove(id);
      logger.info(`---SERVICE_PROVIDER.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Service provider ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
