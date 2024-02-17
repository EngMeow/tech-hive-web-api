import tryCatch from '../utils/tryCatch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageProcessing = tryCatch(async (req, res, next) => {
  if (!req.file) return next();

  try {
    const ext = req.file.mimetype.split('/')[1];
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

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

    await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: filename,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    req.user = updatedUser ?? undefined; 
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', statusCode: 500 });
  }
});

export default imageProcessing;
