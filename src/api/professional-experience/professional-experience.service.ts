import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfessionalExperienceDto } from './dto/create-professional-experience.dto';
import { UpdateProfessionalExperienceDto } from './dto/update-professional-experience.dto';
import { ProfessionalExperience } from './interfaces/professional-experience.interface';
import logger from 'src/utils/logger';
import { Role } from 'src/utils/enums/roles.enum';
import { uploadFile } from 'src/utils/functions/file.upload';

@Injectable()
export class ProfessionalExperienceService {
  constructor(
    @InjectModel('ProfessionalExperience')
    private professionalExperienceModel: Model<ProfessionalExperience>,
  ) {}

  async create(
    createProfessionalExperienceDto: CreateProfessionalExperienceDto,
    requesterId: string,
    requesterRole: string,
    files: Express.Multer.File[],
  ) {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.SERVICE.CREATE INIT---`);

      // Seuls les SuperAdmin et LabAdmin peuvent spécifier le user, sinon utiliser l'ID du requester
      const canSpecifyUser =
        requesterRole === Role.SuperAdmin || requesterRole === Role.LabAdmin;

      // Traiter l'upload du fichier certificat si présent
      let serviceCertificateFileUrl: string | undefined;
      const certificateFile = files.find(
        (file) =>
          file.fieldname === 'serviceCertificateFile' ||
          file.fieldname === 'certificate' ||
          file.fieldname === 'file',
      );
      if (certificateFile) {
        try {
          serviceCertificateFileUrl = await uploadFile(certificateFile);
          logger.info(
            `---PROFESSIONAL_EXPERIENCE.SERVICE.UPLOAD_CERTIFICATE SUCCESS--- url=${serviceCertificateFileUrl}`,
          );
        } catch (uploadError) {
          logger.error(
            `---PROFESSIONAL_EXPERIENCE.SERVICE.UPLOAD_CERTIFICATE ERROR--- ${uploadError.message}`,
          );
          throw new HttpException(
            `Erreur lors de l'upload du certificat: ${uploadError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      // Vérifier que la date de fin est après la date de début
      if (
        new Date(createProfessionalExperienceDto.endDate) <=
        new Date(createProfessionalExperienceDto.startDate)
      ) {
        throw new HttpException(
          'La date de fin doit être postérieure à la date de début',
          HttpStatus.BAD_REQUEST,
        );
      }

      const experienceData = {
        ...createProfessionalExperienceDto,
        user:
          canSpecifyUser && createProfessionalExperienceDto.user
            ? createProfessionalExperienceDto.user
            : requesterId,
        serviceCertificateFile: serviceCertificateFileUrl,
      };

      const experience = await this.professionalExperienceModel.create(
        experienceData,
      );
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.CREATE SUCCESS--- id=${experience._id}`,
      );
      return experience;
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.CREATE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message ||
          "Erreur lors de la création de l'expérience professionnelle",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    user?: string;
    companyName?: string;
  }): Promise<any> {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ALL INIT---`);
      const { page = 1, limit = 10, user, companyName } = query;

      const filters: any = {};
      if (user) filters.user = user;
      if (companyName)
        filters.companyName = { $regex: companyName, $options: 'i' };

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.professionalExperienceModel
          .find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .populate('user', 'firstname lastname email')
          .lean(),
        this.professionalExperienceModel.countDocuments(filters),
      ]);

      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ALL SUCCESS--- total=${total}`,
      );
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ALL ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message ||
          'Erreur lors de la récupération des expériences professionnelles',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ONE INIT--- id=${id}`,
      );
      const experience = await this.professionalExperienceModel
        .findById(id)
        .populate('user', 'firstname lastname email')
        .exec();
      if (!experience) {
        throw new HttpException(
          'Expérience professionnelle non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ONE SUCCESS--- id=${id}`,
      );
      return experience;
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.FIND_ONE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProfessionalExperienceDto: UpdateProfessionalExperienceDto,
    files: Express.Multer.File[],
  ) {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.SERVICE.UPDATE INIT--- id=${id}`);

      const updateData: any = {
        ...updateProfessionalExperienceDto,
        updated_at: new Date(),
      };

      // Vérifier les dates si elles sont fournies
      if (
        updateProfessionalExperienceDto.startDate &&
        updateProfessionalExperienceDto.endDate
      ) {
        if (
          new Date(updateProfessionalExperienceDto.endDate) <=
          new Date(updateProfessionalExperienceDto.startDate)
        ) {
          throw new HttpException(
            'La date de fin doit être postérieure à la date de début',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Traiter l'upload du fichier certificat si présent
      const certificateFile = files.find(
        (file) =>
          file.fieldname === 'serviceCertificateFile' ||
          file.fieldname === 'certificate' ||
          file.fieldname === 'file',
      );
      if (certificateFile) {
        try {
          const serviceCertificateFileUrl = await uploadFile(certificateFile);
          updateData.serviceCertificateFile = serviceCertificateFileUrl;
          logger.info(
            `---PROFESSIONAL_EXPERIENCE.SERVICE.UPDATE.UPLOAD_CERTIFICATE SUCCESS--- url=${serviceCertificateFileUrl}`,
          );
        } catch (uploadError) {
          logger.error(
            `---PROFESSIONAL_EXPERIENCE.SERVICE.UPDATE.UPLOAD_CERTIFICATE ERROR--- ${uploadError.message}`,
          );
          throw new HttpException(
            `Erreur lors de l'upload du certificat: ${uploadError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const updated = await this.professionalExperienceModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('user', 'firstname lastname email')
        .exec();
      if (!updated) {
        throw new HttpException(
          'Expérience professionnelle non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.UPDATE SUCCESS--- id=${id}`,
      );
      return updated;
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.UPDATE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.SERVICE.REMOVE INIT--- id=${id}`);
      const deleted = await this.professionalExperienceModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Expérience professionnelle non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.REMOVE SUCCESS--- id=${id}`,
      );
      return deleted;
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.SERVICE.REMOVE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
