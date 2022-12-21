import express from 'express';
import {
  addProject,
  getProjects,
  updateProject,
} from '../controllers/project.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.use(verifyUser);

router.post('/', addProject);
router.get('/', getProjects);
router.patch('/:projectId', updateProject);

export default router;
