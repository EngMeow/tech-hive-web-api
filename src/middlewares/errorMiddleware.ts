import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

const devError = (res: Response, err: any): void => {
  // Operational, trusted error: send message to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const prodError = (res: Response, err: any): void => {
  // Operational, trusted error: send message to the client
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

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Mongoose Error Handling
  if (err instanceof mongoose.Error.ValidationError) {
    // Customize the error message as needed
    err.message = 'Validation Error: ' + err.message;
  }
  if (err instanceof mongoose.Error.CastError) {
    // Customize the error message as needed
    err.message = 'Cast Error: ' + err.message;
  }

  if (process.env.NODE_ENV === 'development') {
    devError(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    prodError(res, err);
  }
};

export default errorHandler;
