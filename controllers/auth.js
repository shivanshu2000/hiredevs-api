import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password, username, userType } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  if (!username) {
    return next(new ErrorResponse('Please provide a valid username', 400));
  }

  const userByName = await User.findOne({ username });

  if (userByName && username === userByName.username && userByName.isVerified) {
    console.log('here');
    return res.status(409).json({
      success: false,
      error: `Username ${username} is already taken.`,
    });
  }

  const user = await User.findOne({ email });
  if (user && user.isVerified) {
    return res
      .status(409)
      .json({ success: false, error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const code =
    Math.floor(Math.floor(Math.random() * (1000000 - 100000 + 1) + 100000)) +
    '';

  let newUser;

  if (user && !user.isVerified) {
    if (userType === 'client') {
      newUser = await User.findOneAndUpdate(
        { email: email },
        {
          ...req.body,
          password: passwordHash,
          avatar: null,
          githubUsername: null,
          verificationCode: code,
          technologies: [],
        },
        {
          new: true,
        }
      );
    } else {
      newUser = await User.findOneAndUpdate(
        { email: email },
        {
          ...req.body,
          password: passwordHash,
          verificationCode: code,
        },
        {
          new: true,
        }
      );
    }
  } else if (!user) {
    newUser = await User.create({
      ...req.body,
      verificationCode: code,
      password: passwordHash,
    });
  }

  const data = await sendEmail({
    to: email,
    from: '195531@nith.ac.in',
    subject: 'Verify your email',
    text: `
    Thanks for signing up! The sign up code for verifying email is:
    ${code}
    `,
  });

  console.log('data: ', data)

  res.status(200).json({
    success: true,
    message:
      'A 6-digit code has been sent to your email. Enter the code to verify your email',
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select(
    ' -__v -resetToken -verificationCode'
  );
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (user && !user.isVerified) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));

  jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '2d' },
    (err, token) => {
      if (err) {
        return next(new ErrorResponse('Something went wrong', 500));
      }
      res.status(200).json({
        success: true,
        token,
        user,
      });
    }
  );
});

export const verifyCode = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const user = await User.findOne({ verificationCode: code });
  if (!user) return next(new ErrorResponse('Something went wrong', 403));

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      isVerified: true,
      verificationCode: null,
    },
    { new: true }
  );

  const {
    _id,
    email,
    avatar,
    userType,
    technologies,
    username,
    githubUsername,
    total,
    completed,
  } = updatedUser;

  jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '2d' },
    (err, token) => {
      if (err) {
        return next(new ErrorResponse('Something went wrong', 500));
      }

      res.status(200).json({
        success: true,
        token,
        user: {
          _id,
          email,
          avatar,
          userType,
          technologies,
          username,
          githubUsername,
          total,
          completed,
        },
      });
    }
  );
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user: user });
});
