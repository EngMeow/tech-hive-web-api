import { CustomError } from './errors/index';

interface RegisterInputData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
}

const validateRegisterInputs = (data: RegisterInputData): void => {
  const { firstName, lastName, email, password } = data;

  if (!email || !password || !firstName || !lastName ) {
    throw new CustomError('Please provide valid required fields', 400);
  }
};

export default validateRegisterInputs;
