const { dbHelpers, collections } = require('../utils/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ uid: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      accountType,
      carModel,
      carColor,
      carRegistration,
      licenseNumber,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if email already exists
    const existingUsers = await dbHelpers.queryDocuments(collections.users, 'email', '==', email);
    
    // If user exists with same account type, reject
    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      
      if (existingUser.accountType === accountType) {
        return res.status(400).json({
          success: false,
          message: `Email already registered as ${accountType}`,
        });
      }
      
      // Allow same email to register for different account type
      // Verify password matches if they want to add a driver/passenger account
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: 'Password does not match your existing account',
        });
      }

      // Create additional role-specific document with existing user ID
      const userId = existingUser.uid;
      
      if (accountType === 'driver') {
        // Check if driver account already exists
        const existingDriver = await dbHelpers.getDocument(collections.drivers, userId);
        if (existingDriver) {
          return res.status(400).json({
            success: false,
            message: 'Driver account already exists for this email',
          });
        }

        const driverData = {
          uid: userId,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
          email,
          phoneNumber: phoneNumber || existingUser.phoneNumber,
          carModel: carModel || '',
          carColor: carColor || '',
          carRegistration: carRegistration || '',
          licenseNumber: licenseNumber || '',
          isActive: false,
          bankAccountNumber: '',
          bankAccountName: '',
          bankName: '',
          carPicture: null,
          walletBalance: 0,
          completedRides: 0,
          rating: 0,
          totalRatings: 0,
          currentLocation: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await dbHelpers.createDocument(collections.drivers, userId, driverData);
        
        // Update user document to reflect driver account type
        await dbHelpers.updateDocument(collections.users, userId, {
          accountType: 'driver',
          updatedAt: new Date(),
        });
      } else if (accountType === 'passenger') {
        // Check if passenger account already exists
        const existingPassenger = await dbHelpers.getDocument(collections.passengers, userId);
        if (existingPassenger) {
          return res.status(400).json({
            success: false,
            message: 'Passenger account already exists for this email',
          });
        }

        const passengerData = {
          uid: userId,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
          email,
          phoneNumber: phoneNumber || existingUser.phoneNumber,
          cardDetails: [],
          emergencyContact: '',
          completedRides: 0,
          rating: 0,
          totalRatings: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await dbHelpers.createDocument(collections.passengers, userId, passengerData);
        
        // Update user document to reflect passenger account type
        await dbHelpers.updateDocument(collections.users, userId, {
          accountType: 'passenger',
          updatedAt: new Date(),
        });
      }

      // Generate token
      const token = generateToken(userId);

      return res.status(201).json({
        success: true,
        message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account added successfully`,
        token,
        user: {
          id: userId,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
          email,
          accountType,
        },
      });
    }

    // Hash password for new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document with unique ID
    const userId = email.split('@')[0] + '-' + Date.now();
    
    const userData = {
      uid: userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountType,
      password: hashedPassword,
      profilePicture: null,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create user in users collection
    await dbHelpers.createDocument(collections.users, userId, userData);

    // Create role-specific document
    if (accountType === 'driver') {
      const driverData = {
        uid: userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        carModel: carModel || '',
        carColor: carColor || '',
        carRegistration: carRegistration || '',
        licenseNumber: licenseNumber || '',
        isActive: false,
        bankAccountNumber: '',
        bankAccountName: '',
        bankName: '',
        carPicture: null,
        walletBalance: 0,
        completedRides: 0,
        rating: 0,
        totalRatings: 0,
        currentLocation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await dbHelpers.createDocument(collections.drivers, userId, driverData);
    } else if (accountType === 'passenger') {
      const passengerData = {
        uid: userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        cardDetails: [],
        emergencyContact: '',
        completedRides: 0,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await dbHelpers.createDocument(collections.passengers, userId, passengerData);
    }

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        accountType,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const users = await dbHelpers.queryDocuments(collections.users, 'email', '==', email);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.uid);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        rating: user.rating,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get user from users collection
    const user = await dbHelpers.getDocument(collections.users, userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get role-specific data
    let roleData = {};
    if (user.accountType === 'driver') {
      roleData = await dbHelpers.getDocument(collections.drivers, userId);
    } else if (user.accountType === 'passenger') {
      roleData = await dbHelpers.getDocument(collections.passengers, userId);
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        ...roleData,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get profile',
    });
  }
};

// Verify phone number
exports.verifyPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    // Validate inputs
    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required',
      });
    }

    // Test code verification (for development)
    const testCode = '123456';
    
    // Convert to string for comparison to handle both string and number inputs
    if (verificationCode.toString() !== testCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed',
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.uid;
    delete updateData.email;

    // Update user document
    await dbHelpers.updateDocument(collections.users, userId, updateData);

    // If driver, update driver collection too
    if (req.user.accountType === 'driver') {
      await dbHelpers.updateDocument(collections.drivers, userId, updateData);
    } else if (req.user.accountType === 'passenger') {
      await dbHelpers.updateDocument(collections.passengers, userId, updateData);
    }

    // Get updated user
    const updatedUser = await dbHelpers.getDocument(collections.users, userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};
