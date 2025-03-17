import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development'
    : '.env.production';
dotenv.config({ path: envFile });

// Configure AWS S3
const s3Client = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export class S3Utils {
  static async uploadToS3(files: { imagePath?: Express.Multer.File }, folder: string) {
    if (!files || !files.imagePath) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadFile = async (file: Express.Multer.File) => {
      const uniqueFileName = `${folder}/${uuid()}${extname(file.originalname)}`;

      try {
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          },
          partSize: 10 * 1024 * 1024, // 10MB parts (adjust if needed)
          queueSize: 4, // Concurrent uploads (adjust if needed)
        });

        const result = await upload.done();
        return {
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`,
          key: uniqueFileName,
          ...result,
        };
      } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new HttpException(
          'File upload failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

    return uploadFile(files.imagePath);
  }
}
