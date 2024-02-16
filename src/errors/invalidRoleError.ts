import CustomError from './customError';

export default class InvalidRoleError extends CustomError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}
