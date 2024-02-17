// authMiddleware.ts
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tryCatch from '../utils/tryCatch';
import CustomError from '../utils/errors/customError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
}

const protect = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken;

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });

      if (!user) {
        throw new CustomError('No user found', 404);
      }

      req.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        profileImage: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token or unauthorized access' });
    }
  } else {
    throw new CustomError('Not authorized, no token', 401);
  }
});

export { protect };
