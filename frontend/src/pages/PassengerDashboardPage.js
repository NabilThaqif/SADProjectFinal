import React, { useState } from 'react';
import { FiMap, FiDollarSign, FiCheck, FiX, FiMessageCircle, FiStar } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PassengerDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [pickupLocation, setPickupLocation] = useState('UPM Main Gate');
  const [dropoffLocation, setDropoffLocation] = useState('Pavilion KL');
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
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

  const calculateFare = () => {
    // Simple fare calculation: RM 3.00 base + RM 1.50 per km (assuming ~10km for demo)
    const distance = 10;
    const fare = 3.0 + distance * 1.5;
    setEstimatedFare(fare.toFixed(2));
    toast.info(`Estimated fare: RM ${fare.toFixed(2)}`);
  };

  const bookRide = () => {
    if (!estimatedFare) {
      toast.warning('Please search for a ride first');
      return;
    }
    setCurrentRide({
      id: 'ride' + Date.now(),
      from: pickupLocation,
      to: dropoffLocation,
      fare: estimatedFare,
      driver: { name: 'Mohammad Ali', car: 'Toyota Vios', plate: 'WXY1234' },
      status: 'accepted',
      driverLocation: { lat: 3.1219, lng: 101.6869 },
    });
    setActiveTab('booking');
    toast.success('Ride booked successfully!');
  };

  const cancelRide = () => {
    setCurrentRide(null);
    setActiveTab('search');
    toast.info('Ride cancelled');
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
            <span className="text-gray-700">Ahmad Hassan</span>
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
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Search & Book Ride</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dropoff Location
                    </label>
                    <input
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <span>Distance</span>
                    <span>~10 km</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>Base Fare</span>
                    <span>RM 3.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-3">
                    <span>Total</span>
                    <span>RM {estimatedFare}</span>
                  </div>
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

              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Live Location</h2>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">Map showing driver location</span>
                </div>
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
              <button
                onClick={cancelRide}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg mt-6 transition"
              >
                Cancel Ride
              </button>
            </div>
          </div>
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
                        defaultValue="Ahmad"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Hassan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="ahmad@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+60123456789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
