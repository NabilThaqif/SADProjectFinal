const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db, dbHelpers, collections } = require('../utils/database');

/**
 * Create a payment intent for ride payment
 * This creates a Stripe payment intent that can be confirmed on the frontend
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, rideId, currency = 'myr' } = req.body;
    const userId = req.user.uid;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Convert amount to cents (Stripe requires smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        userId: userId,
        rideId: rideId || 'pending',
      },
      description: `UPM Student Cab - Ride Payment`,
    });

    // Store payment intent in database
    const paymentData = {
      paymentIntentId: paymentIntent.id,
      userId: userId,
      rideId: rideId || null,
      amount: amount,
      currency: currency,
      status: 'pending',
      paymentMethod: 'card',
      createdAt: new Date(),
    };

    await dbHelpers.createDocument(
      collections.payments,
      paymentIntent.id,
      paymentData
    );

    res.json({
      success: true,
      message: 'Payment intent created',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

/**
 * Confirm payment after successful Stripe confirmation
 */
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, rideId } = req.body;
    const userId = req.user.uid;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not succeeded yet',
        status: paymentIntent.status,
      });
    }

    // Update payment in database
    const paymentRef = db.collection(collections.payments).doc(paymentIntentId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    await paymentRef.update({
      status: 'completed',
      paymentStatus: 'completed',
      rideId: rideId,
      completedAt: new Date(),
      stripePaymentMethod: paymentIntent.payment_method,
    });

    // Update ride payment status if rideId provided
    if (rideId) {
      const rideRef = db.collection(collections.rides).doc(rideId);
      const rideDoc = await rideRef.get();

      if (rideDoc.exists) {
        await rideRef.update({
          paymentStatus: 'completed',
          paymentIntentId: paymentIntentId,
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      payment: {
        id: paymentIntentId,
        amount: paymentIntent.amount / 100,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
};

/**
 * Get payment history for a user
 */
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.uid;

    const paymentsSnapshot = await db
      .collection(collections.payments)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const payments = [];
    paymentsSnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      payments: payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: error.message,
    });
  }
};

/**
 * Webhook handler for Stripe events
 * This receives real-time updates from Stripe about payment status
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);

      // Update payment status in database
      try {
        const paymentRef = db
          .collection(collections.payments)
          .doc(paymentIntent.id);
        await paymentRef.update({
          status: 'completed',
          paymentStatus: 'completed',
          completedAt: new Date(),
        });
      } catch (error) {
        console.error('Failed to update payment:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      console.log('Payment failed:', failedIntent.id);

      // Update payment status
      try {
        const paymentRef = db
          .collection(collections.payments)
          .doc(failedIntent.id);
        await paymentRef.update({
          status: 'failed',
          paymentStatus: 'failed',
          failedAt: new Date(),
        });
      } catch (error) {
        console.error('Failed to update payment:', error);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Create a test payment with dummy data (for development/testing)
 */
const createTestPayment = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount = 15.5, rideId } = req.body;

    // Create a dummy payment record (skip Stripe for testing)
    const testPaymentId = 'test_payment_' + Date.now();

    const paymentData = {
      paymentIntentId: testPaymentId,
      userId: userId,
      rideId: rideId || null,
      amount: amount,
      currency: 'myr',
      status: 'completed',
      paymentStatus: 'completed',
      paymentMethod: 'test_card',
      cardLastFour: '4242',
      createdAt: new Date(),
      completedAt: new Date(),
      testMode: true,
    };

    await dbHelpers.createDocument(collections.payments, testPaymentId, paymentData);

    // Update ride if rideId provided
    if (rideId) {
      const rideRef = db.collection(collections.rides).doc(rideId);
      const rideDoc = await rideRef.get();

      if (rideDoc.exists) {
        await rideRef.update({
          paymentStatus: 'completed',
          paymentIntentId: testPaymentId,
        });
      }
    }

    res.json({
      success: true,
      message: 'Test payment created successfully',
      payment: paymentData,
    });
  } catch (error) {
    console.error('Create test payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test payment',
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleWebhook,
  createTestPayment,
};
