import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<User> = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'user name is required'],
    minLength: [3, 'user name is too short'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'user name is required'],
    minLength: [3, 'user name is too short'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'user email is required'],
    minLength: [3, 'user name is too short'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'minLength 6 Chars'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const UserModel = mongoose.model<User>('User', userSchema);
