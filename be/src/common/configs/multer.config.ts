import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import * as multer from 'multer';

export const multerOptions: multer.Options = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(
        /^(image\/jpg|image\/jpeg|image\/png|image\/gif|audio\/mpeg|audio\/wav)$/,
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: multer.memoryStorage(), // Use memory storage for S3 upload
};
