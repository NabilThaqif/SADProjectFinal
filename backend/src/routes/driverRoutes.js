const express = require('express');
const { authenticateToken, isDriver } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(isDriver);

// TODO: Add driver routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Driver profile' });
});

module.exports = router;
