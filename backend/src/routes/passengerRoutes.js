const express = require('express');
const { authMiddleware, isPassenger } = require('../middleware/auth');
const { updateProfile, searchRide, bookRide, getRideHistory, rateDriver } = require('../controllers/passengerController');

const router = express.Router();

router.use(authMiddleware);
router.use(isPassenger);

router.put('/profile', updateProfile);
router.post('/search-ride', searchRide);
router.post('/book-ride', bookRide);
router.get('/ride-history', getRideHistory);
router.post('/rate-driver/:rideId', rateDriver);

module.exports = router;
