const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// TODO: Add message routes
router.get('/', (req, res) => {
  res.json({ message: 'Get messages' });
});

module.exports = router;
