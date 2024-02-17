import tryCatch from '../../utils/tryCatch';
import { PrismaClient } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { CustomError, InvalidEmailError, NotFoundError, WeakPasswordError } from '../../utils/errors/index';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Get all User Profiles
const allUsers = tryCatch(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true},
  });

  if (!users || users.length === 0) throw new NotFoundError('Users not found', 404);
  res.status(200).json({ message: 'Success', users });
});

// Get User Profile
const getUserProfile = tryCatch(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  if (!user) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({ message: 'Detailed user profile retrieved successfully', user });
});

// Update User Profile
const updateUserProfile = tryCatch(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    throw new NotFoundError('User not found', 404);
  }

  const updatedData = { firstName, lastName, email, password };

  // Validation on Email & Password
  const handleEmail = async (email: string) => {
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError('Invalid email address.', 400);
    }
    const existingUserWithEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });
    if (existingUserWithEmail) {
      throw new CustomError('Email is already in use', 400);
    }
    updatedData.email = email;
  };

  if (req.user && email) {
    await handleEmail(req.user.email);
  }

  if (password) {
    const isStrongPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (isStrongPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    } else {
      throw new WeakPasswordError('Password is too weak', 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: { id: true, firstName: true, lastName: true, email: true , profileImage: true },
  });

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

// Delete User Profile
const deleteUserProfile = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  if (!deletedUser) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

export {
  getUserProfile,
  updateUserProfile,
  allUsers,
  deleteUserProfile,
};
