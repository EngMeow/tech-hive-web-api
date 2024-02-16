import { Request, Response, NextFunction } from 'express';

export const globalErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message, statusCode });
};
