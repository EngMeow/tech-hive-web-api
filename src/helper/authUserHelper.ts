import generateToken from '../utils/generateToken';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import { CustomError, InvalidEmailError } from '../errors/index';
import { UserModel } from '../databases/models/user.model';

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const validateAuthInputs = (email: string, password: string): void => {
  if (!email || !password) {
    throw new CustomError('Please provide both email and password for authentication',400)
  }

  if (!validator.isEmail(email)) {
    throw new InvalidEmailError('Invalid email', 400);
  }
};

const findUserByEmail = async (email: string): Promise<UserResponse | null> => {
  try {
    const user = await UserModel.findOne({ email });
    return user ? formatUserResponse(user) : null;
  } catch (error) {
    console.error(error);
    throw new CustomError('Internal server error', 500);
  }
};

const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

const formatUserResponse = (user: any): UserResponse => {
  const userResponse: UserResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userResponse;
};


const generateTokenAndSendCookie = (res: any, userId: string): void => {
  generateToken(res, userId);
};

export {
  validateAuthInputs,
  findUserByEmail,
  isPasswordValid,
  formatUserResponse,
  generateTokenAndSendCookie,
};
