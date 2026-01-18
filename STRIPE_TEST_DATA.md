# Stripe Payment Integration - Test Data

## Test Mode Configuration

The application is configured with Stripe test mode for development and testing purposes.

### Dummy Test Card Numbers

Use these test card numbers to simulate different payment scenarios:

#### ✅ Successful Payment
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/26)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)
- **Result**: Payment succeeds

#### ❌ Payment Declined
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Result**: Payment declined (generic decline)

#### ⚠️ Insufficient Funds
- **Card Number**: `4000 0000 0000 9995`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Result**: Card declined (insufficient funds)

#### 🔒 3D Secure Required
- **Card Number**: `4000 0027 6000 3184`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Result**: Requires 3D Secure authentication (test mode auto-succeeds)

#### 💳 Other Test Cards
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`
- **Discover**: `6011 1111 1111 1117`

## Test Payment Mode

The application includes a **"Test Payment"** toggle that allows instant payment approval without entering card details:

1. When booking a ride, you'll see the payment form
2. Check the **"Use test payment"** checkbox
3. Click **"Pay Now (Test)"** button
4. Payment is instantly approved without Stripe processing

## API Endpoints

### Create Payment Intent
```
POST /api/payments/create-intent
Authorization: Bearer <token>
Body: {
  "amount": 18.5,
  "rideId": "ride123"
}
```

### Confirm Payment
```
POST /api/payments/confirm
Authorization: Bearer <token>
Body: {
  "paymentIntentId": "pi_xxx",
  "rideId": "ride123"
}
```

### Create Test Payment (No Stripe)
```
POST /api/payments/test-payment
Authorization: Bearer <token>
Body: {
  "amount": 18.5,
  "rideId": "ride123"
}
```

### Get Payment History
```
GET /api/payments/history
Authorization: Bearer <token>
```

## Environment Variables

### Backend (.env)
```
STRIPE_SECRET_KEY=sk_test_51OTestKeyDummyForDevelopmentPurposesOnly
STRIPE_WEBHOOK_SECRET=whsec_test_dummy_webhook_secret
```

### Frontend (.env.local)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51OTestKeyDummyForDevelopmentPublishableKey
```

## Testing Flow

1. **Login** with test account: `ahmad@example.com` / `password123`
2. **Book a ride**: Enter pickup and dropoff locations
3. **Search rides**: Calculate fare
4. **Confirm booking**: Click "Confirm & Book"
5. **Payment**: 
   - Option A: Check "Use test payment" for instant approval
   - Option B: Use test card `4242 4242 4242 4242`
6. **Success**: Payment processed, ride confirmed

## Dummy Payment Data in Database

The seed script creates sample payment records:

```javascript
{
  paymentId: 'payment1',
  rideId: 'ride1',
  passengerId: 'passenger1',
  driverId: 'driver1',
  amount: 18.5,
  paymentMethod: 'card',
  paymentStatus: 'completed',
  cardLastFour: '1234',
  transactionDate: Date,
  description: 'UPM Main Gate to Pavilion KL'
}
```

## Notes

- All test keys are **dummy values** and won't work with real Stripe
- Replace with actual Stripe test keys from your Stripe Dashboard (https://dashboard.stripe.com/test/apikeys)
- Webhook endpoint: `https://your-domain.com/api/payments/webhook`
- Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:5001/api/payments/webhook`
