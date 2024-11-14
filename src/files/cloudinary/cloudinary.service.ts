import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { envs } from 'src/config';
import { v4 as uuid } from 'uuid'
import { CloudinaryResponse } from './responses';
import { GetCloudinaryImageDto } from './dto';
// import streamifier from 'streamifier';
const streamifier = require('streamifier')

@Injectable()
export class CloudinaryService {

  private readonly logger = new Logger('Cloudinary-service')

  constructor() {

    try {
      cloudinary.config({
        cloud_name: envs.cloudinaryCloudName,
        api_key: envs.cloudinaryApiKey,
        api_secret: envs.cloudinaryApiSecret,
        secure: true
      })
    } catch (error) {
      this.logger.log('Error with cloudinary connection')
      console.log(error)
      throw new Error('Error')
    }

  }

  deliverFromCloudinary(idCloudinary: string, getCloudinaryImageDto: GetCloudinaryImageDto) {
    const { optimizeImage, height, width } = getCloudinaryImageDto
    const url = (optimizeImage) ? this.getOptimizedImage(idCloudinary, width, height) : cloudinary.url(`products-store-app/${idCloudinary}`)
    return {
      url: url
    }
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      // const fileType = file.mimetype.split('/')[1]
      const fileName = `${uuid()}`

      const cloudinaryImage = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products-store-app', // TODO: cloudinary folder hardcoded, fix later
            public_id: fileName
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      return {
        public_id: cloudinaryImage.public_id,
        url: cloudinaryImage.url
      }
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      })
    }
  }

  // This method upload to Cloudinary from image stored locally in the server
  async uploadImageFromPath(imagePath: string) {
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true
    };
    const results = await cloudinary.uploader.upload(imagePath, options)

    const url = cloudinary.url(results.public_id, {
      transformation: [
        {
          fetch_format: 'auto',
          quality: 'auto'
        }
      ]
    })

    return { url }
  }

  private getOptimizedImage(publicId: string, width?: number, height?: number) {
    const imageTag = cloudinary.url(publicId, {
      transformation: [
        { fetch_format: 'auto', quality: 'auto' },
        (width && height) ? { width, height } : {},
      ]
    })

    return imageTag
  }

  async deleteImage(idCloudinary: string) {
    try {
      const res = await cloudinary.uploader.destroy(idCloudinary)

      if (res.result == 'not found') {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: `Can not delete, image with id: [${idCloudinary}] not found`
        })
      }

      return {
        status: 200,
        message: `Image with id: [${idCloudinary}] deleted succesfully`
      }
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      })
    }
  }
}