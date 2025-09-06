import mongoose from 'mongoose';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: 'admin' | 'user';
}

const userSchema = new mongoose.Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

const userModel = mongoose.model<User>('User', userSchema);

export default userModel;
