const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  
  // Location Information
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  dropoffLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  
  // Ride Details
  fare: {
    type: Number,
    required: true
  },
  distance: Number,
  estimatedDuration: Number, // in minutes
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Pickup Status
  pickupStatus: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Timestamps
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  
  // Route history
  routeHistory: [{
    location: {
      coordinates: [Number],
      timestamp: Date
    }
  }]
});

RideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
RideSchema.index({ 'dropoffLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', RideSchema);
