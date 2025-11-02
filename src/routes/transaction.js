import express from 'express';
import { sendMoney, getHistory, getTransaction } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions/send:
 *   post:
 *     summary: Send money via payment channel
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, currency, channel, recipientPhone, recipientName]
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               channel:
 *                 type: string
 *                 enum: [mpesa, stripe, binance_pay]
 *               recipientPhone:
 *                 type: string
 *               recipientName:
 *                 type: string
 *               webhookUrl:
 *                 type: string
 */
router.post('/send', authenticate, sendMoney);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 */
router.get('/history', authenticate, getHistory);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:transactionId', authenticate, getTransaction);

export default router;
