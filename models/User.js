import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is a required field'],
  },

  password: {
    type: String,
    required: [true, 'Password is a required field'],
  },

  technologies: [String],
  avatar: {
    type: String,
    default: null,
  },

  username: {
    type: String,
    default: null,
  },
  userType: {
    type: String,
    default: 'developer',
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  githubUsername: {
    type: String,
  },

  verificationCode: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
