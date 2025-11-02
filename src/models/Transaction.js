import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  channel: {
    type: String,
    enum: ['mpesa', 'stripe', 'binance_pay'],
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  encryptedData: {
    type: String,
    required: true
  },
  webhookUrl: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
