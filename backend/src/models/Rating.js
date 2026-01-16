const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  raterType: {
    type: String,
    enum: ['passenger', 'driver'],
    required: true
  },
  
  // Passenger ratings for driver
  drivingSkills: Number,
  friendliness: Number,
  carCleanliness: Number,
  punctuality: Number,
  
  // Driver ratings for passenger
  passengerPunctuality: Number,
  passengerCleanliness: Number,
  passengerManners: Number,
  
  // Overall
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', RatingSchema);
