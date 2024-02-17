import express from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { upload } from '../../utils/multer';
import imageProcessing from '../../middlewares/imageProcessing';
import {getUserProfile,updateUserProfile,allUsers,deleteUserProfile} from './user.controller'

const userRouter = express.Router();

userRouter.get('/', protect, allUsers);

userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload('profileImage'), imageProcessing, updateUserProfile);

userRouter
  .route('/:id')
  .delete(protect, deleteUserProfile);

export default userRouter;
