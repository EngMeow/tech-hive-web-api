import tryCatch from '../../utils/tryCatch';
import mongoose, { Types } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UserModel } from '../../databases/models/user.model';
import { ApiFeatures } from '../../utils/apiFeatures';
import { CustomError, InvalidEmailError, NotFoundError, WeakPasswordError } from '../../errors/index';
import { Request, Response } from 'express';

// Create User Profile
const createUserProfile = async (userId: Types.ObjectId, ProfileModel: any, role: string) => {
  const ObjectId = mongoose.Types.ObjectId;
  const UserData = await UserModel.findById(userId);
  try {
    const userProfile = await ProfileModel.create({ user: userId });

    const updatedUser = await UserModel.findByIdAndUpdate(userId).select('-password');

    return updatedUser;
  } catch (error) {
    console.error(`Error in createUserProfile for ${role}:`, error);
    throw error;
  }
};

// Get all User Profiles
const allUsers = tryCatch(async (req: Request, res: Response) => {
  let apiFeature = new ApiFeatures(UserModel.find().select('-password'), req.query)
    .paginate().sort().search().filter().fields();

    const users = await apiFeature.mongooseQuery;

  if (!users) throw new NotFoundError('Users not found', 404);
  res.status(200).json({ message: 'Success', users });
});

// Get User Profile
const getUserProfile = tryCatch(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await UserModel.findById(userId).select('-password');

  if (!user) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({ message: 'Detailed user profile retrieved successfully', user });
});


// Update User Profile
const updateUserProfile = tryCatch(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const userId = req.user?._id;

  if (!userId) {
    throw new NotFoundError('User not found', 404);
  }

  const updatedData = { firstName, lastName, email, password };

  // Validation on Email & Password

  const handleEmail = async (email: string) => {
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError('Invalid email address.', 400);
    }
    const existingUserWithEmail = await UserModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUserWithEmail) {
      throw new CustomError('Email is already in use', 400);
    }
    updatedData.email = email;
  };

  if (req.user && email) {
    await handleEmail(req.user?.email);
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

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    updatedData,
    { new: true, select: '-password' }
  );

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

// Delete User Profile
const deleteUserProfile = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(id).exec();

  if (!deletedUser) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  allUsers,
  deleteUserProfile,
};
