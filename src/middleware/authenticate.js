import { verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
