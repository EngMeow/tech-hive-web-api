import { Request, Express } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { CustomError } from './errors/index.js';

const multerOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  
    const simplifiedMimeType = file.mimetype.split(';')[0].trim();
  
    if (allowed.includes(simplifiedMimeType)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

export const upload = (field_name: string) =>
  multer(multerOptions).single(field_name);
