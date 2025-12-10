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
import { PlatformSettingsService } from './platform-settings.service';
import { CreatePlatformSettingDto } from './dto/create-platform-setting.dto';
import { UpdatePlatformSettingDto } from './dto/update-platform-setting.dto';
import logger from 'src/utils/logger';

@Controller('platform-settings')
export class PlatformSettingsController {
  constructor(
    private readonly platformSettingsService: PlatformSettingsService,
  ) {}

  @Post()
  async create(@Body() createPlatformSettingDto: CreatePlatformSettingDto, @Res() res) {
    try {
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.CREATE INIT---`);
      const setting = await this.platformSettingsService.create(createPlatformSettingDto);
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Paramètre de plateforme créé avec succès',
        data: setting
      });
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ALL INIT---`);
      const settings = await this.platformSettingsService.findAll();
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des paramètres de plateforme',
        data: settings
      });
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ONE INIT---`);
      const setting = await this.platformSettingsService.findOne(id);
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Paramètre de plateforme ${id}`,
        data: setting
      });
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlatformSettingDto: UpdatePlatformSettingDto,
    @Res() res,
  ) {
    try {
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.platformSettingsService.update(id, updatePlatformSettingDto);
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Paramètre de plateforme ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.platformSettingsService.remove(id);
      logger.info(`---PLATFORM_SETTINGS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Paramètre de plateforme ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
