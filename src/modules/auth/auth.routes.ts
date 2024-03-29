import express from 'express';
import { authUser, registerUser, logoutUser } from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', registerUser );
authRouter.post('/login', authUser);
authRouter.post('/logout', logoutUser);

export default authRouter;
