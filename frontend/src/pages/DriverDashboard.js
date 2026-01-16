import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { driverService } from '../services/apiService';
import { toast } from 'react-toastify';
import { FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaHistory, FaUser, FaSignOutAlt, FaWallet } from 'react-icons/fa';

export const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.accountType !== 'driver') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleToggleAvailability = async () => {
    setLoading(true);
    
    try {
      await driverService.setAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
      toast.success(`Status updated to ${!isAvailable ? 'Active' : 'Inactive'}`);
      
      if (!isAvailable) {
        loadAvailableRides();
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRides = async () => {
    try {
      const response = await driverService.getAvailableRides();
      setAvailableRides(response.data.availableRides);
    } catch (error) {
      toast.error('Failed to load available rides');
    }
  };

  const loadRideHistory = async () => {
    try {
      const response = await driverService.getRideHistory();
      setRideHistory(response.data.rides);
    } catch (error) {
      toast.error('Failed to load ride history');
    }
  };

  const loadWallet = async () => {
    try {
      const response = await driverService.getWallet();
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      toast.error('Failed to load wallet');
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadRideHistory();
    } else if (activeTab === 'wallet') {
      loadWallet();
    }
  }, [activeTab]);

  const handleAcceptRide = async (rideId) => {
    setLoading(true);
    
    try {
      await driverService.acceptRide(rideId);
      toast.success('Ride accepted!');
      loadAvailableRides();
      navigate(`/driver/ride/${rideId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">UPM Student Cab - Driver</h1>
          <p className="text-sm">Welcome, {user?.firstName}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('profile')} className="p-2 hover:bg-blue-700 rounded">
            <FaUser size={20} />
          </button>
          <button onClick={handleLogout} className="p-2 hover:bg-blue-700 rounded">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 bg-white shadow-lg">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaMapMarkerAlt /> Available Rides
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'history' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaHistory /> Ride History
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'wallet' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaWallet /> Wallet
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaUser /> Profile
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'home' && (
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Available Rides</h2>
                <button
                  onClick={handleToggleAvailability}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white ${
                    isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAvailable ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                  {isAvailable ? 'Active' : 'Inactive'}
                </button>
              </div>

              {!isAvailable && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">You must be active to receive ride requests</p>
                </div>
              )}

              <div className="space-y-4">
                {availableRides.length === 0 ? (
                  <p className="text-gray-600">No available rides at the moment</p>
                ) : (
                  availableRides.map(ride => (
                    <div key={ride._id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-lg">{ride.pickupLocation.address}</p>
                          <p className="text-gray-600">to {ride.dropoffLocation.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">RM {ride.fare.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b">
                        <div>
                          <p className="text-sm text-gray-600">Distance</p>
                          <p className="font-semibold">{ride.distance.toFixed(1)} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Est. Time</p>
                          <p className="font-semibold">{ride.estimatedDuration} min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Passenger Rating</p>
                          <p className="font-semibold">⭐ {ride.passenger?.rating || 'N/A'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptRide(ride._id)}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Accepting...' : 'Accept Ride'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold mb-6">Ride History</h2>
              <div className="space-y-4">
                {rideHistory.length === 0 ? (
                  <p className="text-gray-600">No completed rides yet</p>
                ) : (
                  rideHistory.map(ride => (
                    <div key={ride._id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{ride.pickupLocation.address}</p>
                          <p className="text-sm text-gray-600">{new Date(ride.completedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">RM {ride.fare.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{ride.status}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">Wallet</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-6">
                  <p className="text-sm opacity-90">Available Balance</p>
                  <p className="text-5xl font-bold">RM {walletBalance.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Withdraw Funds
                  </button>
                  <button className="bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
                    Transaction History
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-6">Profile</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-lg">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Rating</label>
                    <p className="text-lg">⭐ {user?.rating || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600">Car Model</label>
                      <p className="text-lg">{user?.carModel || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600">Car Color</label>
                      <p className="text-lg">{user?.carColor || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-600">Registration Number</label>
                      <p className="text-lg">{user?.carRegistrationNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
