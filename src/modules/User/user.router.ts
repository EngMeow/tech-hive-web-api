import express from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { upload } from '../../utils/multer';
import imageProcessing from '../../middlewares/imageProcessing';
import {getUserProfile,updateUserProfile,allUsers,deleteUserProfile} from './user.controller'


//router object
const userRouter = express.Router();

// Routes for all users
userRouter.get('/', protect, allUsers);

// Routes for getting and updating user profile
userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload('profileImage'), imageProcessing, updateUserProfile);

// Routes for updating user status and deleting user profile
userRouter
  .route('/:id')
  .delete(protect, deleteUserProfile);

export default userRouter;
