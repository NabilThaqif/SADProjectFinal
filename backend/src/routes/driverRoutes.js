const express = require('express');
const { authMiddleware, isDriver } = require('../middleware/auth');
const { updateProfile, setAvailability, updateLocation, getAvailableRides, acceptRide, rejectRide, updatePickupStatus, completeRide, ratePassenger, getRideHistory, getWallet } = require('../controllers/driverController');

const router = express.Router();

router.use(authMiddleware);
router.use(isDriver);

router.put('/profile', updateProfile);
router.put('/status', setAvailability);
router.put('/location', updateLocation);
router.get('/available-rides', getAvailableRides);
router.post('/accept-ride/:rideId', acceptRide);
router.post('/reject-ride/:rideId', rejectRide);
router.put('/pickup-status/:rideId', updatePickupStatus);
router.post('/complete-ride/:rideId', completeRide);
router.post('/rate-passenger/:rideId', ratePassenger);
router.get('/ride-history', getRideHistory);
router.get('/wallet', getWallet);

module.exports = router;
