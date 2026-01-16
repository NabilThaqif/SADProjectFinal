require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('express-async-errors');

const { connectDB } = require('./utils/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Database connection check
app.get('/api/db-check', async (req, res) => {
  try {
    const admin = require('mongoose').connection.db.admin();
    const status = await admin.ping();
    res.status(200).json({ message: 'MongoDB connected', status });
  } catch (error) {
    res.status(500).json({ message: 'MongoDB connection failed', error: error.message });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  // Join user to a room based on their ID
  socket.on('user_connected', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} connected`);
  });
  
  // Handle real-time location updates
  socket.on('location_update', (data) => {
    const { userId, latitude, longitude, role } = data;
    io.emit('location_changed', { userId, latitude, longitude, role });
  });
  
  // Handle ride acceptance notifications
  socket.on('ride_accepted', (data) => {
    const { passengerId, driverId, rideData } = data;
    io.to(passengerId).emit('driver_accepted', rideData);
    io.to(driverId).emit('ride_confirmed', rideData);
  });
  
  // Handle driver arrival notification
  socket.on('driver_arriving', (data) => {
    const { passengerId, rideId } = data;
    io.to(passengerId).emit('driver_arrived', { rideId });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  
  res.status(status).json({
    message,
    status,
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

