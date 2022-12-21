import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  let users;

  if (!!req.query.username) {
    users = await User.find({
      username: { $regex: req.query.username, $options: 'i' },
      userType: 'developer',
    });
  } else if (!!req.query.tag) {
    users = await User.find({
      userType: 'developer',
      technologies: { $regex: req.query.tag, $options: 'i' },
    });
  } else {
    users = await User.find({ userType: 'developer' }).limit(10);
  }

  res.status(200).json({ success: true, users });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const username = req.params.username;
  const userData = await User.findOne({ username: username });
  if (!userData) {
    return next(new ErrorResponse(`User not found ${username}`, 400));
  }
  res.status(200).json({ success: true, userData });
});

export const getDashboardData = asyncHandler(async (req, res, next) => {
  let accepted,
    done,
    pendingProjects,
    completedProjects,
    pendingRequests,
    requestedByDeveloper;

  if (req.user.userType === 'client') {
    accepted = await Project.find({
      clientId: req.user._id,
      accepted: true,
    }).countDocuments();
    done = await Project.find({
      clientId: req.user._id,
      takenBack: true,
    }).countDocuments();

    pendingProjects = await Project.find({
      clientId: req.user._id,
      accepted: true,
      takenBack: false,
    }).populate('developerId', 'username _id githubUsername avatar');

    completedProjects = await Project.find({
      clientId: req.user._id,
      accepted: true,
      takenBack: true,
    }).populate('developerId', 'username _id githubUsername avatar');

    requestedByDeveloper = await Project.find({
      clientId: req.user._id,
      completedByDeveloper: true,
      accepted: true,
      takenBack: false,
    }).populate('developerId', 'username _id githubUsername avatar');

    pendingRequests = await Project.find({
      clientId: req.user._id,
      accepted: false,
      takenBack: false,
    }).populate('developerId', 'username _id githubUsername avatar');
  }
  if (req.user.userType === 'developer') {
    accepted = await Project.find({
      developerId: req.user._id,
      accepted: true,
    }).countDocuments();

    done = await Project.find({
      developerId: req.user._id,
      takenBack: true,
    }).countDocuments();

    pendingProjects = await Project.find({
      developerId: req.user._id,
      accepted: true,
      takenBack: false,
    }).populate('clientId', 'username _id');

    completedProjects = await Project.find({
      developerId: req.user._id,
      accepted: true,
      takenBack: true,
    }).populate('clientId', 'username _id');

    pendingRequests = await Project.find({
      developerId: req.user._id,
      accepted: false,
      takenBack: false,
    }).populate('clientId', 'username _id');
  }

  res.status(200).json({
    success: true,
    details: {
      total: accepted,
      completed: done,
      pending: accepted - done,
      pendingProjects,
      completedProjects,
      pendingRequests,
      requestedByDeveloper,
    },
  });
});

export const getNumbers = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const total = await Project.find({
    developerId: user._id,
    accepted: true,
  }).countDocuments();
  const completed = await Project.find({
    developerId: user._id,
    takenBack: true,
  }).countDocuments();
  res.status(200).json({ success: true, profileNumbers: { total, completed } });
});
