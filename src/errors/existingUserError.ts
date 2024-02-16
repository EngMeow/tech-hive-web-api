import CustomError from './customError';
export default class ExistingUserError extends CustomError {
  constructor(message: string, statusCode: number = 409) {
    super(message, statusCode);
  }
}
