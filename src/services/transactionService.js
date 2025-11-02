import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { encrypt } from '../utils/encryption.js';
import axios from 'axios';
import { logger } from '../utils/logger.js';

export const initializeTransaction = async (userId, transactionData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.kycStatus !== 'verified') {
      throw new Error('KYC verification required');
    }

    if (user.accountBalance < transactionData.amount) {
      throw new Error('Insufficient balance');
    }

    const transactionId = \TXN-\-\\;
    
    const encryptedData = encrypt(JSON.stringify({
      amount: transactionData.amount,
      recipientPhone: transactionData.recipientPhone,
      recipientName: transactionData.recipientName,
      channel: transactionData.channel,
      timestamp: new Date()
    }));

    const transaction = new Transaction({
      transactionId,
      userId,
      amount: transactionData.amount,
      currency: transactionData.currency || 'USD',
      channel: transactionData.channel,
      recipientPhone: transactionData.recipientPhone,
      recipientName: transactionData.recipientName,
      encryptedData,
      webhookUrl: transactionData.webhookUrl,
      metadata: transactionData.metadata || {}
    });

    await transaction.save();
    
    // Simulate payment processing
    await processPayment(transaction, transactionData.channel);
    
    logger.info(\Transaction created: \\);
    return transaction;
  } catch (error) {
    logger.error('Transaction initialization error:', error.message);
    throw error;
  }
};

const processPayment = async (transaction, channel) => {
  try {
    // Simulate API calls to payment channels
    const channelEndpoints = {
      mpesa: 'https://api.m-pesa.com/send',
      stripe: 'https://api.stripe.com/v1/transfers',
      binance_pay: 'https://api.binance.com/pay/submit'
    };

    // Simulate external API call
    logger.info(\Processing payment via \: \\);
    
    transaction.status = 'processing';
    await transaction.save();

    // Simulate processing delay
    setTimeout(async () => {
      transaction.status = 'completed';
      await transaction.save();
      
      // Trigger webhook if provided
      if (transaction.webhookUrl) {
        try {
          await axios.post(transaction.webhookUrl, {
            transactionId: transaction.transactionId,
            status: 'completed',
            amount: transaction.amount,
            timestamp: new Date()
          });
        } catch (err) {
          logger.error('Webhook delivery failed:', err.message);
        }
      }
    }, 2000);
  } catch (error) {
    logger.error('Payment processing error:', error.message);
    transaction.status = 'failed';
    await transaction.save();
    throw error;
  }
};

export const getTransactionHistory = async (userId) => {
  try {
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    return transactions;
  } catch (error) {
    logger.error('Get transaction history error:', error.message);
    throw error;
  }
};

export const getTransactionById = async (transactionId, userId) => {
  try {
    const transaction = await Transaction.findOne({ transactionId, userId });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    logger.error('Get transaction error:', error.message);
    throw error;
  }
};
