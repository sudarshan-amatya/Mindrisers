import { Router } from 'express';
import authController from '../controllers/auth';
import checkAuthentication from '../middlewares/auth';

const router = Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me',checkAuthentication, authController.getUser);

export default router;
