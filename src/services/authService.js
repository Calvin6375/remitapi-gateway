import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User(userData);
    await user.save();
    
    logger.info(\User registered: \\);
    return {
      userId: user._id,
      email: user.email,
      kycStatus: user.kycStatus
    };
  } catch (error) {
    logger.error('Registration error:', error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);
    logger.info(\User logged in: \\);
    
    return {
      token,
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  } catch (error) {
    logger.error('Login error:', error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    logger.error('Get user error:', error.message);
    throw error;
  }
};
