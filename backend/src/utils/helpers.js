const jwt = require('jsonwebtoken');

const generateToken = (id, accountType) => {
  return jwt.sign(
    { id, accountType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const calculateFare = (distance) => {
  // Fare calculation: RM 2 base + RM 1 per km
  const baseFare = 2;
  const perKmFare = 1;
  return baseFare + (distance * perKmFare);
};

const calculateRating = (ratings) => {
  if (ratings.length === 0) return 5.0;
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return (sum / ratings.length).toFixed(1);
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  // Malaysia phone number format
  const phoneRegex = /^(\+?6?01)[0-46-9]-?[0-9]{7,8}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  generateToken,
  calculateFare,
  calculateRating,
  validateEmail,
  validatePhoneNumber
};
