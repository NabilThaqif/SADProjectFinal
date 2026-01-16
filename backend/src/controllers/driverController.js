const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Rating = require('../models/Rating');
const Passenger = require('../models/Passenger');
const Payment = require('../models/Payment');

// @desc    Update driver profile
// @route   PUT /api/drivers/:id
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, profilePicture, carModel, carColor, carRegistrationNumber, carPicture, bankAccountNumber, bankAccountHolder, bankName } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (carModel) updateData.carModel = carModel;
    if (carColor) updateData.carColor = carColor;
    if (carRegistrationNumber) updateData.carRegistrationNumber = carRegistrationNumber;
    if (carPicture) updateData.carPicture = carPicture;
    if (bankAccountNumber) updateData.bankAccountNumber = bankAccountNumber;
    if (bankAccountHolder) updateData.bankAccountHolder = bankAccountHolder;
    if (bankName) updateData.bankName = bankName;
    
    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      message: 'Profile updated successfully',
      driver
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// @desc    Set driver availability status
// @route   PUT /api/drivers/status
// @access  Private
exports.setAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'Please provide a valid availability status' });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      { isAvailable },
      { new: true }
    );
    
    res.status(200).json({
      message: `Driver status updated to ${isAvailable ? 'active' : 'inactive'}`,
      driver
    });
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// @desc    Update driver location
// @route   PUT /api/drivers/location
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Please provide latitude and longitude' });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Location updated',
      driver
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};

// @desc    Get available ride requests
// @route   GET /api/drivers/available-rides
// @access  Private
exports.getAvailableRides = async (req, res) => {
  try {
    const driver = await Driver.findById(req.userId);
    
    if (!driver.isAvailable) {
      return res.status(400).json({ message: 'You must be available to receive ride requests' });
    }
    
    // Find pending rides near driver's location
    const availableRides = await Ride.find({
      status: 'pending',
      pickupLocation: {
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: driver.currentLocation.coordinates
            },
            $maxDistance: 5000 // 5km radius
          }
        }
      }
    }).populate('passenger', 'firstName lastName phoneNumber profilePicture rating');
    
    res.status(200).json({
      availableRides
    });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ message: 'Failed to retrieve available rides', error: error.message });
  }
};

// @desc    Accept ride booking
// @route   POST /api/drivers/accept-ride/:rideId
// @access  Private
exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }
    
    ride.driver = req.userId;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    
    await ride.save();
    
    // Populate driver and passenger info
    await ride.populate([
      { path: 'driver', select: 'firstName lastName carModel carColor carRegistrationNumber rating' },
      { path: 'passenger', select: 'firstName lastName phoneNumber profilePicture rating' }
    ]);
    
    res.status(200).json({
      message: 'Ride accepted successfully',
      ride
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Failed to accept ride', error: error.message });
  }
};

// @desc    Reject ride booking
// @route   POST /api/drivers/reject-ride/:rideId
// @access  Private
exports.rejectRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.driver && ride.driver.toString() !== req.userId) {
      return res.status(403).json({ message: 'You did not accept this ride' });
    }
    
    ride.driver = null;
    ride.status = 'pending';
    ride.acceptedAt = null;
    
    await ride.save();
    
    res.status(200).json({
      message: 'Ride rejected',
      ride
    });
  } catch (error) {
    console.error('Reject ride error:', error);
    res.status(500).json({ message: 'Failed to reject ride', error: error.message });
  }
};

// @desc    Update pickup status
// @route   PUT /api/drivers/pickup-status/:rideId
// @access  Private
exports.updatePickupStatus = async (req, res) => {
  try {
    const { pickupStatus } = req.body;
    
    if (!['successful', 'failed'].includes(pickupStatus)) {
      return res.status(400).json({ message: 'Invalid pickup status' });
    }
    
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.driver.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not the driver for this ride' });
    }
    
    if (pickupStatus === 'successful') {
      ride.pickupStatus = 'successful';
      ride.status = 'in-progress';
      ride.startedAt = new Date();
    } else {
      ride.pickupStatus = 'failed';
      ride.status = 'cancelled';
    }
    
    await ride.save();
    
    res.status(200).json({
      message: 'Pickup status updated',
      ride
    });
  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json({ message: 'Failed to update pickup status', error: error.message });
  }
};

// @desc    Complete ride and process payment
// @route   POST /api/drivers/complete-ride/:rideId
// @access  Private
exports.completeRide = async (req, res) => {
  try {
    const { paymentReceivedMethod } = req.body;
    
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.driver.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not the driver for this ride' });
    }
    
    ride.status = 'completed';
    ride.completedAt = new Date();
    
    await ride.save();
    
    // Create payment record
    const payment = new Payment({
      ride: ride._id,
      passenger: ride.passenger,
      driver: ride.driver,
      amount: ride.fare,
      paymentMethod: ride.paymentMethod,
      status: paymentReceivedMethod === 'cash' ? 'completed' : 'pending'
    });
    
    await payment.save();
    
    // If card payment, transfer to driver wallet
    if (ride.paymentMethod === 'card') {
      await Driver.findByIdAndUpdate(
        req.userId,
        {
          $inc: { walletBalance: ride.fare, totalEarnings: ride.fare, completedRides: 1 }
        }
      );
    }
    
    res.status(200).json({
      message: 'Ride completed',
      ride,
      payment
    });
  } catch (error) {
    console.error('Complete ride error:', error);
    res.status(500).json({ message: 'Failed to complete ride', error: error.message });
  }
};

// @desc    Rate passenger
// @route   POST /api/drivers/rate-passenger/:rideId
// @access  Private
exports.ratePassenger = async (req, res) => {
  try {
    const { punctuality, cleanliness, manners, comment } = req.body;
    
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.driver.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only rate passengers for your own rides' });
    }
    
    const overallRating = (punctuality + cleanliness + manners) / 3;
    
    const rating = new Rating({
      rater: req.userId,
      ratee: ride.passenger,
      ride: ride._id,
      raterType: 'driver',
      passengerPunctuality: punctuality,
      passengerCleanliness: cleanliness,
      passengerManners: manners,
      overallRating,
      comment
    });
    
    await rating.save();
    
    // Update passenger's rating
    const allRatings = await Rating.find({ ratee: ride.passenger, raterType: 'driver' });
    const avgRating = allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length;
    
    await Passenger.findByIdAndUpdate(
      ride.passenger,
      { rating: parseFloat(avgRating.toFixed(1)), totalRatings: allRatings.length }
    );
    
    res.status(201).json({
      message: 'Passenger rated successfully',
      rating
    });
  } catch (error) {
    console.error('Rate passenger error:', error);
    res.status(500).json({ message: 'Failed to rate passenger', error: error.message });
  }
};

// @desc    Get ride history
// @route   GET /api/drivers/ride-history
// @access  Private
exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.userId })
      .populate('passenger', 'firstName lastName phoneNumber profilePicture rating')
      .sort({ completedAt: -1 });
    
    res.status(200).json({
      rides
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({ message: 'Failed to retrieve ride history', error: error.message });
  }
};

// @desc    Get wallet balance
// @route   GET /api/drivers/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const driver = await Driver.findById(req.userId).select('walletBalance totalEarnings');
    
    res.status(200).json({
      walletBalance: driver.walletBalance,
      totalEarnings: driver.totalEarnings
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Failed to retrieve wallet', error: error.message });
  }
};

module.exports = exports;
