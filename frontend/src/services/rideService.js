import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const rideService = {
  // Search rides
  searchRides: async (pickupLocation, dropoffLocation) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/passengers/search-rides`,
        {
          pickupLocation,
          dropoffLocation,
        },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  // Book ride
  bookRide: async (rideData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/passengers/book-ride`, rideData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Booking failed' };
    }
  },

  // Cancel ride
  cancelRide: async (rideId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/passengers/cancel-ride`,
        { rideId },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Cancellation failed' };
    }
  },

  // Get ride details
  getRideDetails: async (rideId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/passengers/rides/${rideId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch ride details' };
    }
  },

  // Get passenger rides
  getPassengerRides: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/passengers/rides`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch rides' };
    }
  },

  // Rate driver
  rateDriver: async (rideId, rating) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/passengers/rate-driver`,
        { rideId, ...rating },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Rating failed' };
    }
  },
};

export default rideService;
