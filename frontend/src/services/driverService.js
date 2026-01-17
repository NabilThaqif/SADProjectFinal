import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const driverService = {
  // Get driver profile
  getDriverProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/profile`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch driver profile' };
    }
  },

  // Update driver profile
  updateDriverProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/drivers/profile`, profileData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Toggle driver status
  toggleDriverStatus: async (isActive) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/drivers/status`,
        { isActive },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle status' };
    }
  },

  // Get available drivers
  getAvailableDrivers: async (latitude, longitude) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/available`, {
        params: { latitude, longitude },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch drivers' };
    }
  },

  // Accept ride booking
  acceptRideBooking: async (rideId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/accept-ride`,
        { rideId },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to accept ride' };
    }
  },

  // Reject ride booking
  rejectRideBooking: async (rideId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/reject-ride`,
        { rideId },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject ride' };
    }
  },

  // Update pickup status
  updatePickupStatus: async (rideId, pickupStatus) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/update-pickup-status`,
        { rideId, pickupStatus },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update pickup status' };
    }
  },

  // Get driver rides
  getDriverRides: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/rides`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch rides' };
    }
  },

  // Rate passenger
  ratePassenger: async (rideId, rating) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/rate-passenger`,
        { rideId, ...rating },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to rate passenger' };
    }
  },

  // Complete ride
  completeRide: async (rideId, paymentMethod) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/complete-ride`,
        { rideId, paymentMethod },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete ride' };
    }
  },
};

export default driverService;
