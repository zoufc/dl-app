import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lab } from './interfaces/labs.interface';
import logger from 'src/utils/logger';

@Injectable()
export class LabsService {
  constructor(@InjectModel('Lab') private labModel: Model<Lab>) {}
  async create(createLabDto: CreateLabDto) {
    try {
      logger.info(`---LABS.SERVICE.CREATE INIT---`);

      // Parser latLng si présent et le séparer en lat et lng
      const labData: any = { ...createLabDto };
      if (createLabDto.latLng) {
        const [lat, lng] = createLabDto.latLng
          .split(',')
          .map((coord) => coord.trim());
        if (lat && lng) {
          labData.lat = lat;
          labData.lng = lng;
        } else {
          throw new HttpException(
            'Format latLng invalide. Format attendu: "lat,lng"',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Supprimer latLng du data avant de sauvegarder
        delete labData.latLng;
      }

      const lab = await this.labModel.create(labData);
      logger.info(`---LABS.SERVICE.CREATE SUCCESS---`);
      return lab;
    } catch (error) {
      logger.error(`---LABS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur lors de la création du laboratoire',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMultiple(createLabsDto: CreateLabDto[]) {
    try {
      logger.info(
        `---LABS.SERVICE.CREATE_MULTIPLE INIT--- count=${createLabsDto.length}`,
      );

      const totalCount = createLabsDto.length;

      // Parser latLng pour chaque lab et le séparer en lat et lng
      const labsData = createLabsDto.map((labDto) => {
        const labData: any = { ...labDto };
        if (labDto.latLng) {
          const [lat, lng] = labDto.latLng
            .split(',')
            .map((coord) => coord.trim());
          if (lat && lng) {
            labData.lat = lat;
            labData.lng = lng;
          }
          // Supprimer latLng du data avant de sauvegarder
          delete labData.latLng;
        }
        return labData;
      });

      // Créer tous les labs en une seule opération
      const labs = await this.labModel.insertMany(labsData, {
        ordered: false, // Continue même si certains échouent
      });

      const successCount = labs.length;
      const failedCount = totalCount - successCount;

      logger.info(
        `---LABS.SERVICE.CREATE_MULTIPLE SUCCESS--- created=${successCount}, failed=${failedCount}`,
      );

      return {
        labs,
        successCount,
        failedCount,
        totalCount,
      };
    } catch (error: any) {
      logger.error(`---LABS.SERVICE.CREATE_MULTIPLE ERROR ${error}---`);

      // Si c'est une erreur de bulk write, extraire les détails
      if (error.writeErrors && error.writeErrors.length > 0) {
        const totalCount = createLabsDto.length;
        const successCount = error.insertedCount || 0;
        const failedCount = error.writeErrors.length;

        const errors = error.writeErrors.map((err: any) => ({
          index: err.index,
          code: err.code,
          message: err.errmsg || err.message,
        }));

        throw new HttpException(
          {
            message: 'Erreur lors de la création de certains laboratoires',
            errors,
            successCount,
            failedCount,
            totalCount,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        error.message || 'Erreur lors de la création des laboratoires',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    structure?: string;
    type?: string;
    region?: string;
    department?: string;
  }): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        structure,
        type,
        region,
        department,
      } = query;

      const skip = (page - 1) * limit;

      // Filtres directs sur LAB
      const labFilters: any = {};
      if (structure) labFilters.structure = structure;
      if (type) labFilters.type = type;

      // Filtres sur STRUCTURE via populate.match
      const structureMatch: any = {};
      if (region) structureMatch.region = region;
      if (department) structureMatch.department = department;

      const [data, total] = await Promise.all([
        this.labModel
          .find(labFilters)
          .populate({
            path: 'structure',
            match: structureMatch,
            populate: [
              { path: 'region', select: 'name code' },
              { path: 'department district', select: 'name' },
            ],
          })
          .populate({
            path: 'director responsible',
            select: 'firstname lastname email',
          })
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .lean(),

        this.labModel.countDocuments(labFilters),
      ]);

      return {
        data: data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || 500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const lab = await this.labModel
        .findById(id)
        .populate({
          path: 'structure',
          populate: [
            { path: 'region', select: 'name code' },
            { path: 'department district', select: 'name' },
          ],
        })
        .populate({
          path: 'director responsible',
          select: 'firstname lastname email',
        });
      if (!lab) {
        throw new HttpException('Lab not found', HttpStatus.NOT_FOUND);
      }
      return lab;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || 500,
      );
    }
  }

  async update(id: string, updateLabDto: UpdateLabDto) {
    try {
      logger.info(`---LABS.SERVICE.UPDATE INIT---`);

      // Parser latLng si présent et le séparer en lat et lng
      const updateData: any = { ...updateLabDto, updated_at: new Date() };
      if (updateLabDto.latLng) {
        const [lat, lng] = updateLabDto.latLng
          .split(',')
          .map((coord) => coord.trim());
        if (lat && lng) {
          updateData.lat = lat;
          updateData.lng = lng;
        } else {
          throw new HttpException(
            'Format latLng invalide. Format attendu: "lat,lng"',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Supprimer latLng du data avant de sauvegarder
        delete updateData.latLng;
      }

      const updated = await this.labModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('structure', 'name')
        .populate('director', 'firstname lastname email')
        .populate('responsible', 'firstname lastname email')
        .exec();
      if (!updated) {
        throw new HttpException('Laboratoire non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---LABS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---LABS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---LABS.SERVICE.REMOVE INIT---`);
      const deleted = await this.labModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Laboratoire non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---LABS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---LABS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async countLabsByRegion() {
    try {
      const result = await this.labModel.aggregate([
        // 1. Join avec Structure
        {
          $lookup: {
            from: 'structures',
            localField: 'structure',
            foreignField: '_id',
            as: 'structure',
          },
        },
        { $unwind: '$structure' },

        // 2. Join avec Region
        {
          $lookup: {
            from: 'regions',
            localField: 'structure.region',
            foreignField: '_id',
            as: 'region',
          },
        },
        { $unwind: '$region' },

        // 3. Groupement par région
        {
          $group: {
            _id: '$region._id',
            regionName: { $first: '$region.name' },
            regionCode: { $first: '$region.code' },
            totalLabs: { $sum: 1 },
          },
        },

        // 4. Format final propre
        {
          $project: {
            _id: 0,
            regionId: '$_id',
            regionName: 1,
            regionCode: 1,
            totalLabs: 1,
          },
        },

        // 5. Tri par nombre décroissant
        { $sort: { totalLabs: -1 } },
      ]);

      return result;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findLabsByRegion(
    regionId: string,
    query: {
      page?: number;
      limit?: number;
    },
  ): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const labs = await this.labModel
        .find()
        .populate({
          path: 'structure',
          match: { region: regionId }, // filtre par région
          populate: [
            { path: 'region', select: 'name code' },
            { path: 'department', select: 'name code' },
          ],
        })
        .populate('director', 'firstname lastname email')
        .populate('responsible', 'firstname lastname email')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .lean();

      // Supprimer les labs dont la structure ne correspond pas à la région
      const filteredLabs = labs.filter((lab) => lab.structure !== null);

      const total = filteredLabs.length;

      return {
        data: filteredLabs,
        pagination: {
          total,
          page: Number(page),
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
