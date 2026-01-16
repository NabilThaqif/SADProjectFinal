const User = require('../models/User');
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const { generateToken, validateEmail, validatePhoneNumber } = require('../utils/helpers');

// @desc    Register user (Passenger or Driver)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, password, firstName, lastName, phoneNumber, accountType, ...otherData } = req.body;
    
    // Validate input
    if (!username || !password || !firstName || !lastName || !phoneNumber || !accountType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    if (accountType !== 'passenger' && accountType !== 'driver') {
      return res.status(400).json({ message: 'Account type must be passenger or driver' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or phone number already in use' });
    }
    
    // Additional validation for driver registration
    if (accountType === 'driver') {
      const { carModel, carColor, carRegistrationNumber } = otherData;
      if (!carModel || !carColor || !carRegistrationNumber) {
        return res.status(400).json({ message: 'Driver must provide vehicle details' });
      }
      
      // Create driver account
      const driver = new Driver({
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        accountType: 'driver',
        carModel,
        carColor,
        carRegistrationNumber
      });
      
      await driver.save();
      
      const token = generateToken(driver._id, 'driver');
      return res.status(201).json({
        message: 'Driver registered successfully',
        token,
        user: {
          id: driver._id,
          username: driver.username,
          firstName: driver.firstName,
          lastName: driver.lastName,
          accountType: driver.accountType
        }
      });
    } else {
      // Create passenger account
      const passenger = new Passenger({
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        accountType: 'passenger'
      });
      
      await passenger.save();
      
      const token = generateToken(passenger._id, 'passenger');
      return res.status(201).json({
        message: 'Passenger registered successfully',
        token,
        user: {
          id: passenger._id,
          username: passenger.username,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          accountType: passenger.accountType
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id, user.accountType);
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
  }
};

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Private
exports.verifyPhone = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    
    // In production, verify the OTP from Twilio
    // For now, we'll accept any 6-digit code
    if (!verificationCode || verificationCode.length !== 6) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { phoneVerified: true },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Phone verified successfully',
      user
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ message: 'Phone verification failed', error: error.message });
  }
};
