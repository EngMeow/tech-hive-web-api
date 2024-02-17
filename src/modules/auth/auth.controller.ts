import { Request, Response } from 'express';
import tryCatch from '../../utils/tryCatch';
import { CustomError, ExistingUserError } from '../../utils/errors';
import {
  checkExistingUser,
  createUserRecord,
  formatUserResponse,
  generateTokenAndSendCookie,
  hashUserPassword,
  validateUserInput,
} from '../../utils/helper/registerUserHelper';
import {
  findUserByEmail,
  isPasswordValid,
  validateAuthInputs,
} from '../../utils/helper/authUserHelper';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registerUser = tryCatch(async (req: Request, res: Response): Promise<any> => {
  const userData = req.body;

  validateUserInput(userData);

  const existingUser = await checkExistingUser(userData);

  if (existingUser) {
    throw new ExistingUserError('User already exists', 400);
  }

  const hashedPassword = await hashUserPassword(userData.password);

  let userRecord;

  try {
    userRecord = await createUserRecord(userData, hashedPassword);
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw new CustomError('Registration failed. Please try again later', 500);
  }

  if (userRecord) {
    const userResponse = formatUserResponse(userRecord);
    generateTokenAndSendCookie(res, userRecord.id);
    return res.status(201).json({
      message: 'Registration done successfully',
      user: userResponse,
    });
  } else {
    throw new CustomError('Registration failed. Please try again later', 500);
  }
});

const authUser = tryCatch(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  validateAuthInputs(email, password);

  const user = await findUserByEmail(email);

  if (user && (await isPasswordValid(password, user.password))) {
    generateTokenAndSendCookie(res, user.id);
    const userResponse = formatUserResponse(user);

    return res.status(200).json({
      message: 'Login done successfully',
      user: userResponse,
    });
  } else {
    throw new CustomError('Invalid email or password', 400);
  }
});

const logoutUser = tryCatch(async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('jwt', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'User logged out successfully' });
});

export { authUser, registerUser, logoutUser };
