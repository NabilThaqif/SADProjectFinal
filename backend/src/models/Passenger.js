const mongoose = require('mongoose');
const User = require('./User');

const PassengerSchema = new mongoose.Schema({
  debitCreditCard: {
    cardNumber: {
      type: String,
      select: false
    },
    cardholderName: String,
    expiryDate: String,
    cvv: {
      type: String,
      select: false
    }
  },
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  emergencyContacts: [{
    name: String,
    phoneNumber: String
  }],
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
});

const Passenger = User.discriminator('passenger', PassengerSchema);

module.exports = Passenger;
