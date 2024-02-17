import CustomError from './customError';
export default class ForbiddenError extends CustomError {
  constructor(message: string, statusCode: number = 403) {
    super(message, statusCode);
  }
}
