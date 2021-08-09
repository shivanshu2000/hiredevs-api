import Project from '../models/Project.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from '../models/User.js';

export const getProjects = asyncHandler(async (req, res, next) => {
  const user = req.user;

  let projects;
  if (user.userType === 'client') {
    projects = await Project.find({ clientId: user._id }).populate(
      'developerId'
    );
  } else if (user.userType === 'developer') {
    projects = await Project.find({ developerId: user._id }).populate(
      'clientId'
    );
  }

  res.status(200).json({ success: true, projects });
});

export const addProject = asyncHandler(async (req, res, next) => {
  const clientId = req.user._id;
  const { title, description, developerId } = req.body;

  if (!title || !description || !developerId) {
    return next(new ErrorResponse('Please enter all fields', 400));
  }

  await Project.create({ title, description, developerId, clientId });
  const user = await User.findById(developerId);

  await sendEmail({
    to: user.email,
    from: 'shivanshusr82@gmail.com',
    subject: 'New request',
    text: `
      Hi ${user.email}, you got a request for a project. Kindly visit the website to see.
    `,
  });
  res.status(200).json({ success: true });
});

export const updateProject = asyncHandler(async (req, res, next) => {
  const id = req.params.projectId;

  const n = await Project.findByIdAndUpdate(id, { ...req.body }, { new: true });

  let toEmail, text, subject;
  if (req.body.takenBack) {
    const user = await User.findById(n.developerId).select('email');
    toEmail = user.email;
    subject = 'Project request accepted';
    text = `Your accepting request for ${n.title} is approved by the client`;
  }
  if (req.body.accepted) {
    const user = await User.findById(n.clientId).select('email');
    toEmail = user.email;
    subject = 'Hiring accepted';
    text = `Your hiring request for ${n.title} is accepted by the developer`;
  }
  if (req.body.completedByDeveloper) {
    const user = await User.findById(n.clientId).select('email');
    toEmail = user.email;
    subject = 'Approval request';
    text = `Your ${n.title}'s developer has requested an approval. Do approve the requests to help developers improve their profile`;
  }

  if (toEmail && subject && text) {
    await sendEmail({
      to: toEmail,
      from: 'shivanshusr82@gmail.com',
      subject: subject,
      text: text,
    });
  }
  console.log(toEmail, subject, text);
  res.status(200).json({ success: true, new: n });
});
