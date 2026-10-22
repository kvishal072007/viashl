import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.put('/profile', authenticateJwt, AuthController.updateProfile);
router.get('/me', authenticateJwt, AuthController.getCurrentUser);
router.get('/demo-users', AuthController.listDemoUsers);

export default router;
