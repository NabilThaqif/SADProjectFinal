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
  // Accept various phone formats
  // Allows: +60123456789, 0123456789, 60123456789, 123456789
  const phoneRegex = /^(\+?6?0?)?[0-9]{9,11}$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
};

module.exports = {
  generateToken,
  calculateFare,
  calculateRating,
  validateEmail,
  validatePhoneNumber
};
