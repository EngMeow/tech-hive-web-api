import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tryCatch from '../utils/tryCatch';
import CustomError from '../errors/customError'
import { UserModel } from '../databases/models/user.model';

interface DecodedToken {
  userId: string;

}

const protect = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check if the token exists in the cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // Verify the token using the JWT secret key
  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken;

      // Retrieve the user from the database using the decoded user ID
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        throw new CustomError('No user found', 404);
      }

      // Attach the user to the request object
      req.user = user.toObject();
      // Proceed to the next middleware or controller
      next();
    } catch (error) {
      // Handle any errors during token verification or user retrieval
      console.error(error);
      res.status(401).json({ message: 'Invalid token or unauthorized access' });
    }
  } else {
    // If no token is found, throw an error
    throw new CustomError('Not authorized, no token', 401);
  }
});

export { protect };
