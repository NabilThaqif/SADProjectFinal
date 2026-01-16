import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  verifyPhone: (code) => api.post('/auth/verify-phone', { verificationCode: code })
};

export const passengerService = {
  updateProfile: (data) => api.put('/passengers/profile', data),
  searchRide: (data) => api.post('/passengers/search-ride', data),
  bookRide: (data) => api.post('/passengers/book-ride', data),
  getRideHistory: () => api.get('/passengers/ride-history'),
  rateDriver: (rideId, rating) => api.post(`/passengers/rate-driver/${rideId}`, rating)
};

export const driverService = {
  updateProfile: (data) => api.put('/drivers/profile', data),
  setAvailability: (isAvailable) => api.put('/drivers/status', { isAvailable }),
  updateLocation: (latitude, longitude) => api.put('/drivers/location', { latitude, longitude }),
  getAvailableRides: () => api.get('/drivers/available-rides'),
  acceptRide: (rideId) => api.post(`/drivers/accept-ride/${rideId}`),
  rejectRide: (rideId) => api.post(`/drivers/reject-ride/${rideId}`),
  updatePickupStatus: (rideId, status) => api.put(`/drivers/pickup-status/${rideId}`, { pickupStatus: status }),
  completeRide: (rideId, paymentMethod) => api.post(`/drivers/complete-ride/${rideId}`, { paymentReceivedMethod: paymentMethod }),
  ratePassenger: (rideId, rating) => api.post(`/drivers/rate-passenger/${rideId}`, rating),
  getRideHistory: () => api.get('/drivers/ride-history'),
  getWallet: () => api.get('/drivers/wallet')
};

export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getMessages: (rideId) => api.get(`/messages/${rideId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`)
};
