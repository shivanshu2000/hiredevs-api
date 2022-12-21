import express from 'express';
import { addPost, getPosts, deletePost } from '../controllers/post.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.use(verifyUser);
router.post('/', addPost);

router.get('/:username', getPosts);
router.delete('/:postId', deletePost);

export default router;
