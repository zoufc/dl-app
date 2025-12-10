import { HttpException, Injectable } from '@nestjs/common';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { Model } from 'mongoose';
import { Structure } from './interfaces/structure.interface';
import { InjectModel } from '@nestjs/mongoose';
import logger from 'src/utils/logger';

@Injectable()
export class StructureService {
  constructor(@InjectModel('Structure') private structureModel:Model<Structure>){}
  async create(createStructureDto: CreateStructureDto) {
    try {
      const structure=await this.structureModel.create(createStructureDto)
      return structure
    } catch (error) {
      logger.info(`---STRUCTURE.SERVICE.CREATE ERROR--- ${error}`)
      throw new HttpException(error.message,error.status)
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    regionId?: string;
    level?: string;
    name?: string;
  }) {
    try {
      const { page = 1, limit = 10, regionId, level, name } = query;

      // Construction dynamique des filtres
      const filters: any = {};
      if (regionId) filters.regionId = regionId;
      if (level) filters.level = level;
      if (name) filters.name = { $regex: name, $options: "i" }; // recherche insensible à la casse

      // Pagination
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.structureModel.find(filters).skip(skip).limit(limit).sort({created_at:-1})
        .populate('region', 'name code')
        .populate('department', 'name')    
        .populate('district', 'name')
        .populate('level', 'name'),
        this.structureModel.countDocuments(filters)
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new HttpException(error.message || "Erreur serveur", error.status);
    }
  }


  async findOne(id: string) {
    try {
      const structure=await this.structureModel.findById(id)
      .populate('region', 'name code')
      .populate('department', 'name')    
      .populate('district', 'name')
      .populate('level', 'name')
      return structure
    } catch (error) {
      throw new HttpException(error.message,error.status)
    }
  }

  async update(id: string, updateStructureDto: UpdateStructureDto) {
    try {
      const updated=await this.structureModel.findByIdAndUpdate(id,updateStructureDto,{new:true})
      return updated
    } catch (error) {
      throw new HttpException(error.message,error.status)
    }
  }

  async remove(id: string) {
    try {
      const deleted=await this.structureModel.findByIdAndUpdate(id,{active:false},{new:true})
      return deleted
    } catch (error) {
      throw new HttpException(error.message,error.status)
    }
  }
}
