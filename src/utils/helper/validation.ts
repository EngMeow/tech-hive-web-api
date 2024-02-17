import { BadRequestError } from "../errors/index";
import { Request, Response, NextFunction } from 'express';

const validateRequiredFields = async (req: Request, res: Response, fields: string[]): Promise<void> => {
  for (const field of fields) {
    if (!req.body[field]) {
      throw new BadRequestError(`Please provide ${field}`, 400);
    }
  }
};

export default validateRequiredFields;
