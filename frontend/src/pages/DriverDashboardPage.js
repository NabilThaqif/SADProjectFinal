import React, { useState } from 'react';
import {
  FiMap,
  FiDollarSign,
  FiCheck,
  FiX,
  FiMessageCircle,
  FiStar,
  FiToggleRight,
  FiToggleLeft,
  FiBell,
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isActive, setIsActive] = useState(true);
  const [rideOffers, setRideOffers] = useState([
    {
      id: 'offer1',
      passenger: { name: 'Nur Azahra', rating: 4.8 },
      pickup: 'Sungai Long LRT Station',
      dropoff: 'Mid Valley Megamall',
      fare: 12.0,
      distance: '8.5 km',
      time: '12 mins',
    },
    {
      id: 'offer2',
      passenger: { name: 'Ahmad Hassan', rating: 4.5 },
      pickup: 'One Utama',
      dropoff: 'Kota Damansara',
      fare: 15.5,
      distance: '10 km',
      time: '15 mins',
    },
  ]);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([
    {
      id: 'ride1',
      passenger: 'Ahmad Hassan',
      from: 'UPM Main Gate',
      to: 'Pavilion KL',
      fare: 18.5,
      date: '2024-01-15',
      paymentMethod: 'card',
    },
    {
      id: 'ride2',
      passenger: 'Nur Azahra',
      from: 'Sungai Long LRT',
      to: 'Mid Valley',
      fare: 12.0,
      date: '2024-01-10',
      paymentMethod: 'cash',
    },
  ]);

  const toggleDriverStatus = () => {
    setIsActive(!isActive);
    toast.success(
      isActive ? 'You are now offline' : 'You are now online and available for rides'
    );
  };

  const acceptRide = (offer) => {
    setCurrentRide({
      ...offer,
      status: 'accepted',
      pickupStatus: null,
      passenger: {
        ...offer.passenger,
        profilePicture: '👩',
      },
    });
    setRideOffers(rideOffers.filter((r) => r.id !== offer.id));
    setActiveTab('active-ride');
    toast.success('Ride accepted!');
  };

  const rejectRide = (offerId) => {
    setRideOffers(rideOffers.filter((r) => r.id !== offerId));
    toast.info('Ride rejected');
  };

  const completePickup = () => {
    setCurrentRide({
      ...currentRide,
      pickupStatus: 'successful',
      status: 'in_progress',
    });
    toast.success('Passenger picked up. Ride in progress.');
  };

  const failedPickup = () => {
    setCurrentRide({
      ...currentRide,
      pickupStatus: 'failed',
      status: 'cancelled',
    });
    toast.error('Pickup marked as failed. Ride cancelled.');
  };

  const completeRide = () => {
    toast.success('Ride completed! Please confirm payment.');
    setActiveTab('complete-ride');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiMap size={28} />
            <h1 className="text-2xl font-bold">UPM Student Cab - Driver</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isActive ? (
                <button
                  onClick={toggleDriverStatus}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg transition"
                >
                  <FiToggleRight size={20} />
                  Online
                </button>
              ) : (
                <button
                  onClick={toggleDriverStatus}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                >
                  <FiToggleLeft size={20} />
                  Offline
                </button>
              )}
            </div>
            <span className="text-gray-100">Mohammad Ali</span>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {['dashboard', 'ride-offers', 'active-ride', 'history', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-semibold capitalize ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'dashboard' && 'Dashboard'}
              {tab === 'ride-offers' && `Ride Offers (${rideOffers.length})`}
              {tab === 'active-ride' && 'Active Ride'}
              {tab === 'history' && 'Ride History'}
              {tab === 'profile' && 'Profile'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Today's Earnings</h3>
              <p className="text-3xl font-bold text-green-600">RM 125.50</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Rides Today</h3>
              <p className="text-3xl font-bold text-blue-600">8</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Your Rating</h3>
              <p className="text-3xl font-bold text-yellow-500">4.7 ⭐</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold text-purple-600">RM 250.50</p>
            </div>
          </div>
        )}

        {/* Ride Offers */}
        {activeTab === 'ride-offers' && (
          <div className="space-y-4">
            {!isActive && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
                You are currently offline. Turn on your status to receive ride offers.
              </div>
            )}
            {rideOffers.length > 0 ? (
              rideOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Passenger</p>
                      <p className="font-semibold text-gray-800">{offer.passenger.name}</p>
                      <p className="text-yellow-500 text-sm">{offer.passenger.rating} ⭐</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Pickup → Dropoff</p>
                      <p className="font-semibold text-gray-800">{offer.pickup}</p>
                      <p className="text-gray-600 text-sm">{offer.dropoff}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Fare & Distance</p>
                      <p className="font-semibold text-green-600">RM {offer.fare}</p>
                      <p className="text-gray-600 text-sm">{offer.distance} ({offer.time})</p>
                    </div>
                    <div className="flex gap-2 items-end">
                      <button
                        onClick={() => acceptRide(offer)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <FiCheck /> Accept
                      </button>
                      <button
                        onClick={() => rejectRide(offer.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FiBell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No ride offers at the moment</p>
                <p className="text-gray-500">Stay online to receive ride requests</p>
              </div>
            )}
          </div>
        )}

        {/* Active Ride */}
        {activeTab === 'active-ride' && currentRide && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Passenger Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Details</h2>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl">
                    {currentRide.passenger.profilePicture}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {currentRide.passenger.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FiStar className="text-yellow-400" /> {currentRide.passenger.rating} (
                      {Math.floor(Math.random() * 20 + 5)} ratings)
                    </p>
                  </div>
                </div>
              </div>

              {/* Pickup Status */}
              {!currentRide.pickupStatus && (
                <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Pickup Status</h2>
                  <p className="text-gray-700 mb-4">Have you successfully picked up the passenger?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={completePickup}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FiCheck size={20} /> Successful Pickup
                    </button>
                    <button
                      onClick={failedPickup}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FiX size={20} /> Failed Pickup
                    </button>
                  </div>
                </div>
              )}

              {/* Active Ride Info */}
              {currentRide.pickupStatus === 'successful' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Ride in Progress
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Pickup:</span>
                      <span className="font-semibold">{currentRide.pickup}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Destination:</span>
                      <span className="font-semibold">{currentRide.dropoff}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Distance:</span>
                      <span className="font-semibold">{currentRide.distance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fare:</span>
                      <span className="font-semibold text-green-600">RM {currentRide.fare}</span>
                    </div>
                  </div>
                  <button
                    onClick={completeRide}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-6 transition"
                  >
                    Complete Ride
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMessageCircle /> Messages
                </h2>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  <div className="bg-gray-100 rounded p-3 mr-8">
                    <p className="text-sm">Passenger: Thank you, see you soon!</p>
                  </div>
                  <div className="bg-green-100 rounded p-3 ml-8">
                    <p className="text-sm">You: I'm on my way!</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-6">Route Summary</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheck className="text-2xl mt-1" />
                  <div>
                    <p className="font-semibold">{currentRide.pickup}</p>
                    <p className="text-sm text-green-100">Pickup</p>
                  </div>
                </div>
                <div className="border-l-2 border-green-300 ml-4 h-12"></div>
                <div className="flex items-start gap-3">
                  <FiMap className="text-2xl mt-1" />
                  <div>
                    <p className="font-semibold">{currentRide.dropoff}</p>
                    <p className="text-sm text-green-100">Destination</p>
                  </div>
                </div>
                <div className="border-t border-green-400 pt-4 mt-4">
                  <p className="text-sm text-green-100 mb-2">Estimated Fare</p>
                  <p className="text-3xl font-bold">RM {currentRide.fare}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complete Ride Payment */}
        {activeTab === 'complete-ride' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Ride & Payment</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">Cash Payment</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" className="w-4 h-4" />
                      <span className="text-gray-700">Card Payment (Auto Transfer)</span>
                    </label>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Ride Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Passenger</span>
                        <span>Ahmad Hassan</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Route</span>
                        <span>UPM → Pavilion KL</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Distance</span>
                        <span>10 km</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold text-green-600">
                        <span>Total Fare</span>
                        <span>RM 18.50</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                    Request Rating
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                    Complete Transaction
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-6">Earnings Summary</h3>
              <div className="space-y-4">
                <div className="bg-purple-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-purple-100 mb-1">Today's Earnings</p>
                  <p className="text-3xl font-bold">RM 125.50</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-purple-100 mb-1">Wallet Balance</p>
                  <p className="text-3xl font-bold">RM 250.50</p>
                </div>
              </div>
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
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Fare
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rideHistory.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{ride.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ride.passenger}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ride.from} → {ride.to}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        RM {ride.fare}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ride.paymentMethod === 'card'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {ride.paymentMethod === 'card' ? 'Card' : 'Cash'}
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Mohammad"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Ali"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Car Model
                      </label>
                      <input
                        type="text"
                        defaultValue="Toyota Vios"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Registration
                      </label>
                      <input
                        type="text"
                        defaultValue="WXY1234"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Account
                    </label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-6">Driver Stats</h3>
              <div className="space-y-4">
                <div className="bg-green-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-green-100 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-green-100 mb-1">Your Rating</p>
                  <p className="text-3xl font-bold">4.7 ⭐</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-lg p-4">
                  <p className="text-sm text-green-100 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">RM 5,285</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
