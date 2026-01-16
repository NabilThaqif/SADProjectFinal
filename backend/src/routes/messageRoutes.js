const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const router = express.Router();

router.use(authMiddleware);

// @desc    Send message
// @route   POST /api/messages
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { ride, receiver, message } = req.body;
    
    if (!ride || !receiver || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const newMessage = new Message({
      ride,
      sender: req.userId,
      receiver,
      message
    });
    
    await newMessage.save();
    
    // Emit socket event for real-time messaging
    req.io.to(receiver).emit('new_message', newMessage);
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// @desc    Get messages for a ride
// @route   GET /api/messages/:rideId
// @access  Private
router.get('/:rideId', async (req, res) => {
  try {
    const messages = await Message.find({ ride: req.params.rideId })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('receiver', 'firstName lastName profilePicture');
    
    res.status(200).json({
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
router.put('/:messageId/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
});

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('ride');
    
    res.status(200).json({
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
});

module.exports = router;
