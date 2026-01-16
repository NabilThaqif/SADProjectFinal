const mongoose = require('mongoose');
const User = require('./User');

const DriverSchema = new mongoose.Schema({
  // Vehicle Information
  carModel: {
    type: String,
    required: [true, 'Please provide car model']
  },
  carColor: {
    type: String,
    required: [true, 'Please provide car color']
  },
  carRegistrationNumber: {
    type: String,
    required: [true, 'Please provide car registration number'],
    unique: true
  },
  carPicture: String,
  vehicleOwnershipCertificate: String,
  drivingLicense: String,
  
  // Bank Details
  bankAccountNumber: String,
  bankAccountHolder: String,
  bankName: String,
  
  // Status & Location
  isAvailable: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  
  // Financial Information
  walletBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Documents & Verification
  documentsVerified: {
    type: Boolean,
    default: false
  },
  
  // Ride History
  completedRides: {
    type: Number,
    default: 0
  },
  rideHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  
  // Bank Transfer History
  bankTransferHistory: [{
    amount: Number,
    date: Date,
    status: String
  }]
});

// Index for geospatial queries
DriverSchema.index({ 'currentLocation': '2dsphere' });

const Driver = User.discriminator('driver', DriverSchema);

module.exports = Driver;
