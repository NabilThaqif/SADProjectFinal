const express = require('express');
const { register, login, getMe, verifyPhone } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/verify-phone', authMiddleware, verifyPhone);

module.exports = router;
