import generateToken from '../generateToken';
import validateRegisterInputs from '../validateRegisterInputs';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { InvalidEmailError, WeakPasswordError } from '../errors/index';

const prisma = new PrismaClient();

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const validateUserInput = (userData: any): void => {
  validateRegisterInputs(userData);

  if (!validator.isEmail(userData.email)) {
    throw new InvalidEmailError('Invalid email');
  }

  const isStrongPassword = validator.isStrongPassword(userData.password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrongPassword) {
    throw new WeakPasswordError(
      'Password is too weak. It should include at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.',
      400
    );
  }
};

const checkExistingUser = async (userData: any): Promise<UserResponse | null> => {
  return await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
};

const hashUserPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUserRecord = async (userData: any, hashedPassword: string): Promise<UserResponse> => {
  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return formatUserResponse(user);
  } catch (error) {
    console.error('Error in createUserRecord:', error);
    throw error; // rethrow the error for further handling in the calling function
  }
};

const formatUserResponse = (user: any): UserResponse => {
  const userResponse: UserResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return userResponse;
};

const generateTokenAndSendCookie = (res: any, userId: string): void => {
  generateToken(res, userId);
};

export {
  generateTokenAndSendCookie,
  formatUserResponse,
  createUserRecord,
  hashUserPassword,
  checkExistingUser,
  validateUserInput,
};
