import { HttpException, HttpStatus } from '@nestjs/common';
import logger from '../logger';
import { S3 } from 'aws-sdk';
import { Express } from 'express';

const fs = require('fs');
const path = require('path');

export async function uploadFile(file: Express.Multer.File) {
  try {
    logger.info('-----FILES.SERVICE.UPLOADFILES-----id : ----INIT');
    if (file.size > 7000000)
      throw new HttpException(
        'La taille de fichier autorisée est de 7Mo maximum',
        HttpStatus.BAD_REQUEST,
      );

    const s3 = getS3();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';
    if (path.extname(file['originalname']).toLowerCase().indexOf('jpg') > -1) {
      fileExtension = 'jpg';
    }
    if (path.extname(file['originalname']).toLowerCase().indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (
      path.extname(file['originalname']).toLowerCase().indexOf('png') > -1
    ) {
      fileExtension = 'png';
    } else if (
      path.extname(file['originalname']).toLowerCase().indexOf('webp') > -1
    ) {
      fileExtension = 'webp';
    }
    const fileBuffer = fs.readFileSync(file.path);
    const uploadResult = await s3
      .upload({
        ACL: 'public-read',
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: fileBuffer,
        Key: `${uniqueSuffix}.${fileExtension}`,
      })
      .promise();
    deleteFileAfterSaveOnS3Bucket(file);
    return uploadResult.Location;
  } catch (error) {
    throw new HttpException(error.message, error.status);
  }
}

function getS3() {
  return new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
}

async function deleteFileAfterSaveOnS3Bucket(file) {
  await fs.unlink(file.path, (err) => {
    if (err)
      logger.info('--- deleteFileAfterSaveOnS3Bucket - erro delete file');
    else {
      logger.info('--- deleteFileAfterSaveOnS3Bucket - deleted successfully');
    }
  });
}
