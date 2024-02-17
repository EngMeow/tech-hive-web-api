import CustomError from './customError';

export default class NotFoundError extends CustomError {
  constructor(message: string, statusCode: number = 404) {
    super(message, statusCode);
  }
}
