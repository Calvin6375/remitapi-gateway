import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { logger } from '../src/utils/logger.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Create seed users
    const seedUsers = [
      {
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        country: 'US',
        idNumber: 'ID001',
        kycStatus: 'verified',
        accountBalance: 5000
      },
      {
        email: 'jane.smith@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+254712345678',
        country: 'KE',
        idNumber: 'ID002',
        kycStatus: 'verified',
        accountBalance: 10000
      },
      {
        email: 'bob.wilson@example.com',
        password: 'SecurePass123!',
        firstName: 'Bob',
        lastName: 'Wilson',
        phone: '+234802345678',
        country: 'NG',
        idNumber: 'ID003',
        kycStatus: 'pending',
        accountBalance: 1000
      }
    ];

    const createdUsers = await User.insertMany(seedUsers);
    logger.info(\Seeded \ users successfully\);

    createdUsers.forEach(user => {
      logger.info(\Created user: \\);
    });

  } catch (error) {
    logger.error('Seed error:', error.message);
    throw error;
  } finally {
    await disconnectDB();
  }
};

seedDatabase();
