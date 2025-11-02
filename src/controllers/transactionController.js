import { initializeTransaction, getTransactionHistory, getTransactionById } from '../services/transactionService.js';
import { logger } from '../utils/logger.js';

export const sendMoney = async (req, res, next) => {
  try {
    const transactionData = req.body;
    const transaction = await initializeTransaction(req.userId, transactionData);
    res.status(201).json({
      message: 'Transaction initiated',
      data: transaction
    });
  } catch (error) {
    logger.error('Send money error:', error.message);
    next({ statusCode: 400, message: error.message });
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const transactions = await getTransactionHistory(req.userId);
    res.status(200).json({
      message: 'Transaction history retrieved',
      data: transactions
    });
  } catch (error) {
    logger.error('Get history error:', error.message);
    next({ statusCode: 500, message: error.message });
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await getTransactionById(transactionId, req.userId);
    res.status(200).json({
      message: 'Transaction retrieved',
      data: transaction
    });
  } catch (error) {
    logger.error('Get transaction error:', error.message);
    next({ statusCode: 404, message: error.message });
  }
};
