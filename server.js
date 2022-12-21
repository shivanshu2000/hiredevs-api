dotenv.config({ path: './config/config.env' });
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config()

import errorHandler from './middlewares/errorHandler.js';

console.log(process.env.SENDGRID_API_KEY);

connectDB();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

import auth from './routes/auth.js';
import project from './routes/project.js';
import user from './routes/user.js';
import post from './routes/post.js';

app.use('/api/auth', auth);
app.use('/api/projects', project);
app.use('/api/users', user);
app.use('/api/posts', post);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App is listenting on port ', PORT);
});
