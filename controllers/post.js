import Post from '../models/Post.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

export const addPost = asyncHandler(async (req, res, next) => {
  const { title, description, webUrl } = req.body;

  const user = req.user;

  if (!!webUrl) {
    if (!webUrl.includes('https://')) {
      return next(new ErrorResponse('Please enter a valid website url', 400));
    }
  }

  if (user.userType === 'client') next(new ErrorResponse('Unauthorized', 401));

  if (!title || !description) {
    return next(new ErrorResponse('Please enter all the details', 400));
  }

  const post = await Post.create({ ...req.body, developerName: user.username });

  res.status(201).json({ success: true, post });
});

export const getPosts = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const username = req.params.username;
  //   if (user.userType === 'client') next(new ErrorResponse('Unauthorized', 401));

  const posts = await Post.find({ developerName: username });
  res.status(200).json({ success: true, posts });
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const postId = req.params.postId;
  if (user.userType === 'client') {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({ success: true });
});
