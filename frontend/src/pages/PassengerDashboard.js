import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { passengerService } from '../services/apiService';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaSearch, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';

export const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rideHistory, setRideHistory] = useState([]);

  useEffect(() => {
    if (!user || user.accountType !== 'passenger') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock coordinates (in production, use Google Maps API)
      const pickupCoordinates = [101.6964, 3.1390]; // Default to Kuala Lumpur
      const dropoffCoordinates = [101.5901, 3.1478];
      
      const response = await passengerService.searchRide({
        pickupLocation,
        pickupCoordinates,
        dropoffLocation,
        dropoffCoordinates
      });
      
      setSearchResults(response.data);
      toast.success('Ride search completed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please enter both locations');
      return;
    }

    setLoading(true);
    
    try {
      const pickupCoordinates = [101.6964, 3.1390];
      const dropoffCoordinates = [101.5901, 3.1478];
      
      const response = await passengerService.bookRide({
        pickupLocation,
        pickupCoordinates,
        dropoffLocation,
        dropoffCoordinates,
        paymentMethod: 'card'
      });
      
      toast.success('Ride booked successfully!');
      navigate(`/passenger/ride/${response.data.ride._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const loadRideHistory = async () => {
    try {
      const response = await passengerService.getRideHistory();
      setRideHistory(response.data.rides);
    } catch (error) {
      toast.error('Failed to load ride history');
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadRideHistory();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">UPM Student Cab</h1>
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
              <FaSearch /> Book Ride
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
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">Book a Ride</h2>
              
              <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Pickup Location
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Dropoff Location
                  </label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Enter dropoff location"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search Rides'}
                </button>
              </form>

              {searchResults && (
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Ride Details</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Fare</p>
                      <p className="text-2xl font-bold text-blue-600">RM {searchResults.fare.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Distance</p>
                      <p className="text-2xl font-bold text-blue-600">{searchResults.distance.toFixed(1)} km</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Est. Time</p>
                      <p className="text-2xl font-bold text-blue-600">{searchResults.estimatedDuration} min</p>
                    </div>
                  </div>

                  <button
                    onClick={handleBookRide}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold mb-6">Ride History</h2>
              <div className="space-y-4">
                {rideHistory.length === 0 ? (
                  <p className="text-gray-600">No rides yet</p>
                ) : (
                  rideHistory.map(ride => (
                    <div key={ride._id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{ride.pickupLocation.address} → {ride.dropoffLocation.address}</p>
                          <p className="text-sm text-gray-600">{new Date(ride.requestedAt).toLocaleDateString()}</p>
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

          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-6">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-lg">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Account Type</label>
                  <p className="text-lg capitalize">{user?.accountType}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Rating</label>
                  <p className="text-lg">⭐ {user?.rating || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
