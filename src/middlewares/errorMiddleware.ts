import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const devError = (res: Response, err: any): void => {

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const prodError = (res: Response, err: any): void => {

  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if (err.code === 'P2025') {
    err.message = 'Invalid input: ' + err.message;
  }

  try {
    await prisma.$disconnect();
  } catch (disconnectError) {
    console.error('Error disconnecting Prisma Client:', disconnectError);
  }

  if (process.env.NODE_ENV === 'development') {
    devError(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    prodError(res, err);
  }
};

export default errorHandler;
