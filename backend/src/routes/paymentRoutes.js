const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleWebhook,
  createTestPayment,
} = require('../controllers/paymentController');

// Public webhook endpoint (no auth - verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes (require authentication)
router.post('/create-intent', authenticateToken, createPaymentIntent);
router.post('/confirm', authenticateToken, confirmPayment);
router.get('/history', authenticateToken, getPaymentHistory);

// Test endpoint for development (creates dummy payment without Stripe)
router.post('/test-payment', authenticateToken, createTestPayment);

module.exports = router;
