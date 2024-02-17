export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
