import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { paymentService } from '../services/apiService';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PaymentForm = ({ amount, rideId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [useTestCard, setUseTestCard] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Option 1: Use test payment endpoint (no real Stripe processing)
      if (useTestCard) {
        const response = await paymentService.createTestPayment({
          amount: amount,
          rideId: rideId,
        });

        if (response.data.success) {
          toast.success('Payment processed successfully!');
          onSuccess(response.data.payment);
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Option 2: Real Stripe payment flow
        
        // Step 1: Create payment intent
        const intentResponse = await paymentService.createIntent({
          amount: amount,
          rideId: rideId,
        });

        if (!intentResponse.data.success) {
          throw new Error(intentResponse.data.message);
        }

        const { clientSecret, paymentIntentId } = intentResponse.data;

        // Step 2: Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (paymentIntent.status === 'succeeded') {
          // Step 3: Confirm payment in backend
          const confirmResponse = await paymentService.confirmPayment({
            paymentIntentId: paymentIntentId,
            rideId: rideId,
          });

          if (confirmResponse.data.success) {
            toast.success('Payment successful!');
            onSuccess(confirmResponse.data.payment);
          } else {
            throw new Error(confirmResponse.data.message);
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <FiCreditCard className="text-2xl text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">RM {amount}</span>
        </div>
      </div>

      {/* Test Card Toggle */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useTestCard}
            onChange={(e) => setUseTestCard(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            Use test payment (Skip Stripe, instant approval)
          </span>
        </label>
      </div>

      {!useTestCard && (
        <>
          {/* Test Card Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <p className="font-semibold mb-1">Test Cards:</p>
            <p>✓ Success: 4242 4242 4242 4242</p>
            <p>✗ Decline: 4000 0000 0000 0002</p>
            <p className="text-xs mt-1">Any future date, any 3-digit CVC</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <FiLock />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={processing}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stripe || processing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay RM ${amount}`}
              </button>
            </div>
          </form>
        </>
      )}

      {useTestCard && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              ✓ Test mode enabled. Click "Pay Now" to simulate a successful payment without
              entering card details.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
            >
              {processing ? 'Processing...' : 'Pay Now (Test)'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
