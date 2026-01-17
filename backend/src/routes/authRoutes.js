const express = require('express');
const { register, login, getUserProfile, verifyPhoneNumber, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getUserProfile);
router.post('/verify-phone', verifyPhoneNumber);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
