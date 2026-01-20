import React, { useState, useEffect } from 'react';
import { FiMap, FiCheck, FiMessageCircle, FiStar } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MapComponent from '../components/MapComponent';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import authService from '../services/authService';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Location coordinates mapping for UPM area
const LOCATION_COORDINATES = {
  'UPM Main Gate': { lat: 3.1245, lng: 101.6878 },
  'Pavilion KL': { lat: 3.1575, lng: 101.6804 },
  'Sungai Long LRT Station': { lat: 3.0428, lng: 101.8043 },
  'Mid Valley Megamall': { lat: 3.1179, lng: 101.6779 },
  'One Utama': { lat: 3.1477, lng: 101.6146 },
  'Kota Damansara': { lat: 3.1728, lng: 101.5872 },
  'UPM Library': { lat: 3.1235, lng: 101.6850 },
  'UPM Sports Complex': { lat: 3.1180, lng: 101.6920 },
  'Cyberjaya': { lat: 2.9258, lng: 101.6158 },
  'Setiawangsa': { lat: 3.1667, lng: 101.6833 },
  'Fakulti Sains Komputer dan Teknologi Maklumat': { lat: 3.0041, lng: 101.6901 },
  'KLIA Terminal 1': { lat: 2.7450, lng: 101.7097 },
};

const getCoordinates = (locationName) => {
  return LOCATION_COORDINATES[locationName] || { lat: 3.1219, lng: 101.6869 }; // Default to UPM center
};

const PassengerDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [userData, setUserData] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          // Try to get full profile from API
          try {
            const response = await authService.getUserProfile();
            if (response.success) {
              setUserData(response.user);
            } else {
              setUserData(user);
            }
          } catch (err) {
            // Fallback to localStorage user data
            setUserData(user);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadUserProfile();
  }, []);
  const [currentRide, setCurrentRide] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [driverRating, setDriverRating] = useState(0);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [rideHistory, setRideHistory] = useState([
    {
      id: 'ride1',
      date: '2024-01-15',
      driver: 'Mohammad Ali',
      from: 'UPM Main Gate',
      to: 'Pavilion KL',
      fare: 18.5,
      status: 'completed',
    },
    {
      id: 'ride2',
      date: '2024-01-10',
      driver: 'Fatimah Ibrahim',
      from: 'Sungai Long LRT',
      to: 'Mid Valley',
      fare: 12.0,
      status: 'completed',
    },
  ]);

  const calculateFare = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.warning('Please enter both pickup and dropoff locations');
      return;
    }

    try {
      // Use Google Geocoding API to get coordinates from location names
      const geocodeLocation = async (locationName) => {
        // First try to match with predefined coordinates
        if (LOCATION_COORDINATES[locationName]) {
          return LOCATION_COORDINATES[locationName];
        }

        // Otherwise use Google Geocoding API
        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: locationName }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              reject(new Error('Location not found'));
            }
          });
        });
      };

      // Get coordinates for both locations
      const pickup = await geocodeLocation(pickupLocation);
      const dropoff = await geocodeLocation(dropoffLocation);
      
      // Store coordinates for later use in booking
      setPickupCoords(pickup);
      setDropoffCoords(dropoff);

      // Use Google Distance Matrix (client-side) for road distance
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps not loaded');
      }

      const distanceService = new window.google.maps.DistanceMatrixService();

      const element = await new Promise((resolve, reject) => {
        distanceService.getDistanceMatrix(
          {
            origins: [{ lat: pickup.lat, lng: pickup.lng }],
            destinations: [{ lat: dropoff.lat, lng: dropoff.lng }],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            const el = response?.rows?.[0]?.elements?.[0];
            if (status === 'OK' && el?.status === 'OK') {
              resolve(el);
            } else {
              reject(new Error(`Distance Matrix error: ${status}`));
            }
          }
        );
      });

      const distanceInMeters = element.distance.value;
      const distanceInKm = distanceInMeters / 1000;

      // Fare calculation: RM 1 per kilometer (no base fare)
      const fare = distanceInKm * 1.0;

      setEstimatedFare(fare.toFixed(2));
      toast.info(`Estimated fare: RM ${fare.toFixed(2)} (${distanceInKm.toFixed(1)} km)`);
    } catch (error) {
      console.error('Error calculating fare:', error);
      toast.error('Failed to calculate fare. Please check your locations.');
    }
  };

  const bookRide = () => {
    if (!estimatedFare) {
      toast.warning('Please search for a ride first');
      return;
    }
    if (!pickupCoords || !dropoffCoords) {
      toast.warning('Location coordinates not found. Please search again.');
      return;
    }

    setCurrentRide({
      id: 'ride' + Date.now(),
      from: pickupLocation,
      to: dropoffLocation,
      fare: estimatedFare,
      driver: { name: 'Mohammad Ali', car: 'Toyota Vios', plate: 'WXY1234' },
      status: 'pending_payment',
      driverLocation: { lat: 3.0025, lng: 101.7092 }, // Driver at Fakulti Sains Komputer
      pickupLocation: pickupCoords, // Use geocoded coordinates
      dropoffLocation: dropoffCoords, // Use geocoded coordinates
    });
    setRouteInfo(null);
    setShowPayment(true);
    setActiveTab('booking');
  };

  const handlePaymentSuccess = (payment) => {
    setShowPayment(false);
    setCurrentRide({
      ...currentRide,
      status: 'accepted',
      paymentId: payment.id,
    });
    toast.success('Payment successful! Driver will pick you up soon.');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    toast.info('Payment cancelled. You can try again later.');
  };

  const cancelRide = () => {
    setCurrentRide(null);
    setActiveTab('search');
    toast.info('Ride cancelled');
  };

  const completeRide = () => {
    setShowRatingPrompt(true);
  };

  const submitRating = () => {
    if (driverRating === 0) {
      toast.warning('Please select a rating');
      return;
    }
    
    // Add completed ride to history
    const completedRideEntry = {
      id: `ride${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      driver: currentRide.driver.name,
      from: pickupLocation,
      to: dropoffLocation,
      fare: estimatedFare,
      status: 'completed',
      rating: driverRating,
    };
    
    setRideHistory([completedRideEntry, ...rideHistory]);
    
    toast.success(`Thank you! You rated ${currentRide.driver.name} ${driverRating} star${driverRating !== 1 ? 's' : ''}`);
    setRideCompleted(true);
    setShowRatingPrompt(false);
    setTimeout(() => {
      setCurrentRide(null);
      setRideCompleted(false);
      setDriverRating(0);
      setActiveTab('history'); // Switch to history tab to show the new ride
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiMap size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">UPM Student Cab</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : 'Loading...'}
            </span>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {['search', 'booking', 'history', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-semibold capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'search' && 'Book Ride'}
              {tab === 'booking' && 'Current Ride'}
              {tab === 'history' && 'Ride History'}
              {tab === 'profile' && 'Profile'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Book Ride */}
        {activeTab === 'search' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6" style={{ overflow: 'visible' }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Search & Book Ride</h2>
                <div className="space-y-4" style={{ overflow: 'visible' }}>
                  <div style={{ overflow: 'visible' }}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <LocationAutocomplete
                      value={pickupLocation}
                      onChange={setPickupLocation}
                      placeholder="Enter pickup location..."
                    />
                  </div>
                  <div style={{ overflow: 'visible' }}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dropoff Location
                    </label>
                    <LocationAutocomplete
                      value={dropoffLocation}
                      onChange={setDropoffLocation}
                      placeholder="Enter dropoff location..."
                    />
                  </div>
                  <button
                    onClick={calculateFare}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Search Rides
                  </button>
                </div>
              </div>
            </div>

            {/* Fare Display */}
            {estimatedFare && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Fare Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>From</span>
                    <span className="text-right text-sm">{pickupLocation}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>To</span>
                    <span className="text-right text-sm">{dropoffLocation}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-3">
                    <span>Total Fare</span>
                    <span>RM {estimatedFare}</span>
                  </div>
                  <p className="text-xs text-blue-100 mt-3">Rate: RM 1.00 per km (no base fare)</p>
                </div>
                <button
                  onClick={bookRide}
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg mt-6 hover:bg-gray-100 transition"
                >
                  Confirm & Book
                </button>
              </div>
            )}
          </div>
        )}

        {/* Current Ride */}
        {activeTab === 'booking' && currentRide && (
          <>
            {showPayment ? (
              <div className="max-w-2xl mx-auto">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={parseFloat(currentRide.fare)}
                    rideId={currentRide.id}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </Elements>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Driver Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver Details</h2>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {currentRide.driver.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FiStar className="text-yellow-400" /> 4.7 (25 ratings)
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Vehicle:</span> {currentRide.driver.car}
                  </p>
                  <p>
                    <span className="font-semibold">Plate:</span> {currentRide.driver.plate}
                  </p>
                </div>
              </div>

              {/* Live Map with Route */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Live Route</h2>
                {currentRide.pickupLocation && currentRide.dropoffLocation ? (
                  <MapComponent
                    driverLocation={currentRide.driverLocation}
                    pickupLocation={currentRide.pickupLocation}
                    destinationLocation={currentRide.dropoffLocation}
                    showRoute={true}
                    center={currentRide.driverLocation}
                    onRouteCalculated={(info) => setRouteInfo(info)}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Loading route…</p>
                )}
                {routeInfo && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Driver → Pickup</p>
                      <p className="font-semibold text-blue-600">{routeInfo.toPickup.duration}</p>
                      <p className="text-xs text-gray-500">{routeInfo.toPickup.distance}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Pickup → Destination</p>
                      <p className="font-semibold text-green-600">{routeInfo.toDestination.duration}</p>
                      <p className="text-xs text-gray-500">{routeInfo.toDestination.distance}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMessageCircle /> Messages
                </h2>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  <div className="bg-blue-100 rounded p-3 ml-8">
                    <p className="text-sm">Driver: I'm on my way, will be there in 5 minutes</p>
                  </div>
                  <div className="bg-gray-100 rounded p-3 mr-8">
                    <p className="text-sm">You: Great, I'll be at the gate</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Ride Status */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-6">Ride Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiCheck className="text-2xl" />
                  <div>
                    <p className="font-semibold">{currentRide.from}</p>
                    <p className="text-sm text-green-100">Pickup</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-2xl" />
                  <div>
                    <p className="font-semibold">{currentRide.to}</p>
                    <p className="text-sm text-green-100">Dropoff</p>
                  </div>
                </div>
                <div className="border-t border-green-400 pt-4 mt-4">
                  <p className="text-sm text-green-100 mb-2">Estimated Fare</p>
                  <p className="text-3xl font-bold">RM {currentRide.fare}</p>
                </div>
              </div>
              {!rideCompleted ? (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={completeRide}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition"
                  >
                    ✓ Ride Completed
                  </button>
                  <button
                    onClick={cancelRide}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Cancel Ride
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                  <p className="text-center text-green-800 font-semibold">✓ Ride Completed</p>
                </div>
              )}
            </div>
          </div>
            )}

            {/* Rating Prompt Modal */}
            {showRatingPrompt && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10000 }}>
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate Your Ride</h2>
                  <p className="text-gray-600 mb-6">How was your experience with {currentRide.driver.name}?</p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setDriverRating(star)}
                        className={`text-4xl transition ${
                          star <= driverRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {/* Rating Display */}
                  {driverRating > 0 && (
                    <p className="text-center text-lg font-semibold text-gray-700 mb-6">
                      {driverRating} star{driverRating !== 1 ? 's' : ''}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRatingPrompt(false);
                        setDriverRating(0);
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitRating}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Ride History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">Ride History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Fare
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rideHistory.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{ride.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ride.driver}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ride.from} → {ride.to}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        RM {ride.fare}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userData?.firstName || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userData?.lastName || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData?.email || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData?.phoneNumber || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Details
                    </label>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-6">Account Stats</h3>
              <div className="space-y-4">
                <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold">15</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">Your Rating</p>
                  <p className="text-3xl font-bold">4.5 ⭐</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold">RM 245.50</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PassengerDashboard;
