import express from 'express';
import { signup, login, verifyCode, getUser } from '../controllers/auth.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-code', verifyCode);
router.get('/user', verifyUser, getUser);

export default router;
