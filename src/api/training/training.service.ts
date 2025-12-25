import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { Training } from './interfaces/training.interface';
import logger from 'src/utils/logger';
import { Role } from 'src/utils/enums/roles.enum';
import { uploadFile } from 'src/utils/functions/file.upload';

@Injectable()
export class TrainingService {
  constructor(
    @InjectModel('Training')
    private trainingModel: Model<Training>,
  ) {}

  async create(
    createTrainingDto: CreateTrainingDto,
    requesterId: string,
    requesterRole: string,
    files: Express.Multer.File[],
  ) {
    try {
      logger.info(`---TRAINING.SERVICE.CREATE INIT---`);

      // Seuls les admins peuvent spécifier le user, sinon utiliser l'ID du requester
      const isAdmin =
        requesterRole === Role.SuperAdmin ||
        requesterRole === Role.RegionAdmin ||
        requesterRole === Role.LabAdmin;

      // Traiter l'upload du fichier diplôme si présent
      let diplomaUrl: string | undefined;
      const diplomaFile = files.find(
        (file) => file.fieldname === 'diploma' || file.fieldname === 'file',
      );
      if (diplomaFile) {
        try {
          diplomaUrl = await uploadFile(diplomaFile);
          logger.info(
            `---TRAINING.SERVICE.UPLOAD_DIPLOMA SUCCESS--- url=${diplomaUrl}`,
          );
        } catch (uploadError) {
          logger.error(
            `---TRAINING.SERVICE.UPLOAD_DIPLOMA ERROR--- ${uploadError.message}`,
          );
          throw new HttpException(
            `Erreur lors de l'upload du diplôme: ${uploadError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const trainingData = {
        ...createTrainingDto,
        user:
          isAdmin && createTrainingDto.user
            ? createTrainingDto.user
            : requesterId,
        diploma: diplomaUrl,
      };

      const training = await this.trainingModel.create(trainingData);
      logger.info(`---TRAINING.SERVICE.CREATE SUCCESS--- id=${training._id}`);
      return training;
    } catch (error) {
      logger.error(`---TRAINING.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors de la création de la formation',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    user?: string;
    type?: string;
    country?: string;
  }): Promise<any> {
    try {
      logger.info(`---TRAINING.SERVICE.FIND_ALL INIT---`);
      const { page = 1, limit = 10, user, type, country } = query;

      const filters: any = { active: true };
      if (user) filters.user = user;
      if (type) filters.type = { $regex: type, $options: 'i' };
      if (country) filters.country = { $regex: country, $options: 'i' };

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.trainingModel
          .find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .populate('user', 'firstname lastname email')
          .lean(),
        this.trainingModel.countDocuments(filters),
      ]);

      logger.info(`---TRAINING.SERVICE.FIND_ALL SUCCESS--- total=${total}`);
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---TRAINING.SERVICE.FIND_ALL ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des formations',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---TRAINING.SERVICE.FIND_ONE INIT--- id=${id}`);
      const training = await this.trainingModel
        .findById(id)
        .populate('user', 'firstname lastname email')
        .exec();
      if (!training) {
        throw new HttpException('Formation non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---TRAINING.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return training;
    } catch (error) {
      logger.error(`---TRAINING.SERVICE.FIND_ONE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateTrainingDto: UpdateTrainingDto,
    files: Express.Multer.File[],
  ) {
    try {
      logger.info(`---TRAINING.SERVICE.UPDATE INIT--- id=${id}`);

      const updateData: any = { ...updateTrainingDto, updated_at: new Date() };

      // Traiter l'upload du fichier diplôme si présent
      const diplomaFile = files.find(
        (file) => file.fieldname === 'diploma' || file.fieldname === 'file',
      );
      if (diplomaFile) {
        try {
          const diplomaUrl = await uploadFile(diplomaFile);
          updateData.diploma = diplomaUrl;
          logger.info(
            `---TRAINING.SERVICE.UPDATE.UPLOAD_DIPLOMA SUCCESS--- url=${diplomaUrl}`,
          );
        } catch (uploadError) {
          logger.error(
            `---TRAINING.SERVICE.UPDATE.UPLOAD_DIPLOMA ERROR--- ${uploadError.message}`,
          );
          throw new HttpException(
            `Erreur lors de l'upload du diplôme: ${uploadError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const updated = await this.trainingModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('user', 'firstname lastname email')
        .exec();
      if (!updated) {
        throw new HttpException('Formation non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---TRAINING.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---TRAINING.SERVICE.UPDATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---TRAINING.SERVICE.REMOVE INIT--- id=${id}`);
      // Soft delete - désactiver au lieu de supprimer
      const deleted = await this.trainingModel
        .findByIdAndUpdate(
          id,
          { active: false, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!deleted) {
        throw new HttpException('Formation non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---TRAINING.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---TRAINING.SERVICE.REMOVE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
