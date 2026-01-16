const Passenger = require('../models/Passenger');
const Ride = require('../models/Ride');
const Rating = require('../models/Rating');
const Payment = require('../models/Payment');
const Driver = require('../models/Driver');
const { calculateFare } = require('../utils/helpers');

// @desc    Update passenger profile
// @route   PUT /api/passengers/:id
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, profilePicture, debitCreditCard } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (debitCreditCard) updateData.debitCreditCard = debitCreditCard;
    
    const passenger = await Passenger.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      message: 'Profile updated successfully',
      passenger
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// @desc    Search rides
// @route   POST /api/passengers/search-ride
// @access  Private
exports.searchRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupCoordinates, dropoffCoordinates } = req.body;
    
    if (!pickupLocation || !dropoffLocation || !pickupCoordinates || !dropoffCoordinates) {
      return res.status(400).json({ message: 'Please provide pickup and dropoff locations with coordinates' });
    }
    
    // Calculate distance and fare (simplified)
    const distance = calculateDistance(pickupCoordinates, dropoffCoordinates);
    const fare = calculateFare(distance);
    
    // Find available drivers nearby
    const nearbyDrivers = await Driver.find({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: pickupCoordinates
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    }).select('_id carModel carColor carRegistrationNumber rating');
    
    res.status(200).json({
      distance,
      fare,
      estimatedDuration: Math.ceil(distance / 40), // Assume 40 km/h average speed
      nearbyDrivers: nearbyDrivers.length
    });
  } catch (error) {
    console.error('Search ride error:', error);
    res.status(500).json({ message: 'Failed to search ride', error: error.message });
  }
};

// @desc    Book a ride
// @route   POST /api/passengers/book-ride
// @access  Private
exports.bookRide = async (req, res) => {
  try {
    const { pickupLocation, pickupCoordinates, dropoffLocation, dropoffCoordinates, paymentMethod } = req.body;
    
    if (!pickupLocation || !pickupCoordinates || !dropoffLocation || !dropoffCoordinates || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required booking details' });
    }
    
    const distance = calculateDistance(pickupCoordinates, dropoffCoordinates);
    const fare = calculateFare(distance);
    
    const ride = new Ride({
      passenger: req.userId,
      pickupLocation: {
        address: pickupLocation,
        coordinates: {
          type: 'Point',
          coordinates: pickupCoordinates
        }
      },
      dropoffLocation: {
        address: dropoffLocation,
        coordinates: {
          type: 'Point',
          coordinates: dropoffCoordinates
        }
      },
      fare,
      distance,
      estimatedDuration: Math.ceil(distance / 40),
      paymentMethod,
      status: 'pending'
    });
    
    await ride.save();
    
    // Populate passenger info
    await ride.populate('passenger', 'firstName lastName phoneNumber profilePicture');
    
    res.status(201).json({
      message: 'Ride booking created',
      ride
    });
  } catch (error) {
    console.error('Book ride error:', error);
    res.status(500).json({ message: 'Failed to book ride', error: error.message });
  }
};

// @desc    Get ride history
// @route   GET /api/passengers/ride-history
// @access  Private
exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ passenger: req.userId })
      .populate('driver', 'firstName lastName carModel carColor carRegistrationNumber rating')
      .sort({ requestedAt: -1 });
    
    res.status(200).json({
      rides
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({ message: 'Failed to retrieve ride history', error: error.message });
  }
};

// @desc    Rate driver
// @route   POST /api/passengers/rate-driver/:rideId
// @access  Private
exports.rateDriver = async (req, res) => {
  try {
    const { drivingSkills, friendliness, carCleanliness, punctuality, comment } = req.body;
    
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.passenger.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only rate your own rides' });
    }
    
    const overallRating = (drivingSkills + friendliness + carCleanliness + punctuality) / 4;
    
    const rating = new Rating({
      rater: req.userId,
      ratee: ride.driver,
      ride: ride._id,
      raterType: 'passenger',
      drivingSkills,
      friendliness,
      carCleanliness,
      punctuality,
      overallRating,
      comment
    });
    
    await rating.save();
    
    // Update driver's rating
    const allRatings = await Rating.find({ ratee: ride.driver, raterType: 'passenger' });
    const avgRating = allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length;
    
    await Driver.findByIdAndUpdate(
      ride.driver,
      { rating: parseFloat(avgRating.toFixed(1)), totalRatings: allRatings.length }
    );
    
    res.status(201).json({
      message: 'Driver rated successfully',
      rating
    });
  } catch (error) {
    console.error('Rate driver error:', error);
    res.status(500).json({ message: 'Failed to rate driver', error: error.message });
  }
};

// Helper function to calculate distance
function calculateDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = exports;
