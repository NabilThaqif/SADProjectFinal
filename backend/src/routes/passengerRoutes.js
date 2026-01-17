const express = require('express');
const { authenticateToken, isPassenger } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(isPassenger);

// TODO: Add passenger routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Passenger profile' });
});

module.exports = router;

module.exports = router;
