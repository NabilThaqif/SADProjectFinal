const jwt = require('jsonwebtoken');
const { dbHelpers, collections } = require('../utils/database');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await dbHelpers.getDocument(collections.users, decoded.uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = {
      uid: decoded.uid,
      email: user.email,
      accountType: user.accountType,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const isPassenger = (req, res, next) => {
  if (req.user.accountType !== 'passenger') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Passenger account required.',
    });
  }
  next();
};

const isDriver = (req, res, next) => {
  if (req.user.accountType !== 'driver') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Driver account required.',
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isPassenger,
  isDriver,
};
