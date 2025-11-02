import { registerUser, loginUser, getUserById } from '../services/authService.js';
import { logger } from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await registerUser(userData);
    res.status(201).json({
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    logger.error('Register error:', error.message);
    next({ statusCode: 400, message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    logger.error('Login error:', error.message);
    next({ statusCode: 401, message: error.message });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);
    res.status(200).json({
      message: 'Profile retrieved',
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error.message);
    next({ statusCode: 404, message: error.message });
  }
};
