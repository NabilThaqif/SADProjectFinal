const express = require('express');
const { authenticateToken, isPassenger } = require('../middleware/auth');
const passengerController = require('../controllers/passengerController');

const router = express.Router();

router.use(authenticateToken);
router.use(isPassenger);

// Passenger routes
router.get('/profile', passengerController.getPassengerProfile);
router.put('/profile', passengerController.updateProfile);
router.post('/calculate-fare', passengerController.calculateFareWithDistance);
router.get('/search-ride', passengerController.searchRide);
router.post('/book-ride', passengerController.bookRide);
router.get('/ride-history', passengerController.getRideHistory);
router.put('/rate-driver/:rideId', passengerController.rateDriver);

module.exports = router;
