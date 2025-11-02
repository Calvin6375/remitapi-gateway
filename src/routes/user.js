import express from 'express';
import { getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
router.get('/profile', authenticate, getProfile);

export default router;
