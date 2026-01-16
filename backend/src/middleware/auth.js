const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.accountType = decoded.accountType;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isPassenger = (req, res, next) => {
  if (req.accountType !== 'passenger') {
    return res.status(403).json({ message: 'Access denied. Passenger account required.' });
  }
  next();
};

const isDriver = (req, res, next) => {
  if (req.accountType !== 'driver') {
    return res.status(403).json({ message: 'Access denied. Driver account required.' });
  }
  next();
};

module.exports = { authMiddleware, isPassenger, isDriver };
