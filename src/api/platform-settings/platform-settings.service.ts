import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlatformSettingDto } from './dto/create-platform-setting.dto';
import { UpdatePlatformSettingDto } from './dto/update-platform-setting.dto';
import { Model } from 'mongoose';
import { PlatformSettings } from './interfaces/platform-settings.interface';
import { InjectModel } from '@nestjs/mongoose';
import logger from 'src/utils/logger';

@Injectable()
export class PlatformSettingsService {
  constructor(
    @InjectModel('PlatformSettings')
    private platformSettingsModel: Model<PlatformSettings>,
  ) {}
  async create(createPlatformSettingDto: CreatePlatformSettingDto) {
    try {
      const existActiveSetting = await this.platformSettingsModel
        .findOne({ active: true })
        .sort({ created_at: -1 })
        .exec();
      if (existActiveSetting) {
        throw new HttpException(
          'Une configuration active existe déjà!',
          HttpStatus.CONFLICT,
        );
      }
      const settings = await this.platformSettingsModel.create(
        createPlatformSettingDto,
      );
      return settings;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      const settingsList = await this.platformSettingsModel.find().exec();
      return settingsList;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getActiveOne() {
    try {
      const activeSettings = await this.platformSettingsModel
        .findOne({ active: true })
        .sort({ created_at: -1 });
      if (!activeSettings) {
        throw new HttpException(
          'Service indisponible!',
          HttpStatus.BAD_REQUEST,
        );
      }
      return activeSettings;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---PLATFORM_SETTINGS.SERVICE.FIND_ONE INIT---`);
      const setting = await this.platformSettingsModel.findById(id).exec();
      if (!setting) {
        throw new HttpException(
          'Paramètre de plateforme non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---PLATFORM_SETTINGS.SERVICE.FIND_ONE SUCCESS---`);
      return setting;
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePlatformSettingDto: UpdatePlatformSettingDto) {
    try {
      logger.info(`---PLATFORM_SETTINGS.SERVICE.UPDATE INIT---`);
      const updated = await this.platformSettingsModel
        .findByIdAndUpdate(
          id,
          { ...updatePlatformSettingDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          'Paramètre de plateforme non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---PLATFORM_SETTINGS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---PLATFORM_SETTINGS.SERVICE.REMOVE INIT---`);
      const deleted = await this.platformSettingsModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Paramètre de plateforme non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---PLATFORM_SETTINGS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---PLATFORM_SETTINGS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
