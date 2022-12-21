import express from 'express';
import {
  getUsers,
  getUser,
  getDashboardData,
  getNumbers,
} from '../controllers/user.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

// router.use(verifyUser);

router.get('/', getUsers);
router.get('/dashboard', verifyUser, getDashboardData);
router.get('/count/:username', verifyUser, getNumbers);
router.get('/:username', getUser);

export default router;
