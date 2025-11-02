import express from 'express';
import { Transaction } from '../models/Transaction.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/webhooks/confirm:
 *   post:
 *     summary: Handle transaction confirmation webhook
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               status:
 *                 type: string
 *               confirmationCode:
 *                 type: string
 */
router.post('/confirm', async (req, res) => {
  try {
    const { transactionId, status, confirmationCode } = req.body;
    
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = status || transaction.status;
    transaction.metadata.confirmationCode = confirmationCode;
    transaction.updatedAt = new Date();
    
    await transaction.save();
    
    logger.info(\Webhook received for transaction: \\);
    res.status(200).json({
      message: 'Webhook processed',
      transactionId: transaction.transactionId
    });
  } catch (error) {
    logger.error('Webhook error:', error.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
