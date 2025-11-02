import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/remitapi';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnect error:', error);
    throw error;
  }
};
