import tryCatch from '../utils/tryCatch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

const User = mongoose.model('User');

const imageProcessing = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split('/')[1];
  const userId = (req.user as any).id; // Assuming req.user is of type any

  const filename = `${req.file.fieldname}-${userId}-${uuidv4()}-${Date.now()}.${ext}`;

  const filepath = path.join(
    __dirname,
    'backend',
    'public',
    'uploads',
    filename
  );

  if (!fs.existsSync('./backend/public/uploads')) {
    fs.mkdirSync('./backend/public/uploads', { recursive: true });
  }

  await sharp(req.file.buffer)
    .resize(1400, 1400)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(filepath);

  (req.user as any).image = filename; // Assuming req.user is of type any

  await (req.user as any).save(); // Assuming req.user is of type any

  next();
});

export default imageProcessing;
