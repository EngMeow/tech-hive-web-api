import { Response } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../errors/customError';

const generateToken = (res: Response, userId: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const secretKey: string = process.env.JWT_SECRET;
    const token: string = jwt.sign({ userId }, secretKey, { expiresIn: '5h' });
    res.cookie('jwt', token, { httpOnly: true });

  } catch (error) {
    console.error('Error generating token:', error);
    throw new CustomError('Error generating token', 500);
  }
};

export default generateToken;
