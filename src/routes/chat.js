const express = require('express');
const chatRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create Message Model
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

// GET: Get messages between two users
chatRouter.get('/chat/messages/:userId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if the other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser._id, receiverId: userId },
        { senderId: userId, receiverId: loggedInUser._id }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('senderId', 'firstName lastName')
    .populate('receiverId', 'firstName lastName');

    // Format messages for frontend
    const formattedMessages = messages.map(message => ({
      _id: message._id,
      senderId: message.senderId._id,
      receiverId: message.receiverId._id,
      message: message.message,
      timestamp: message.timestamp,
      senderName: `${message.senderId.firstName} ${message.senderId.lastName}`
    }));

    res.json({
      message: 'Messages fetched successfully',
      data: formattedMessages
    });
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

// POST: Send a message
chatRouter.post('/chat/send', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { receiverId, message } = req.body;

    // Validate input
    if (!receiverId || !message) {
      return res.status(400).json({ error: 'Receiver ID and message are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Create new message
    const newMessage = new Message({
      senderId: loggedInUser._id,
      receiverId: receiverId,
      message: message.trim()
    });

    await newMessage.save();

    // Populate sender info for response
    await newMessage.populate('senderId', 'firstName lastName');

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        _id: newMessage._id,
        senderId: newMessage.senderId._id,
        receiverId: newMessage.receiverId,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
        senderName: `${newMessage.senderId.firstName} ${newMessage.senderId.lastName}`
      }
    });
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

// GET: Get user profile for chat (to display chat partner info)
chatRouter.get('/chat/user/:userId', userAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid user ID for chat:', userId)
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('firstName lastName photo age about skills gender');
    
    if (!user) {
      console.log('❌ User not found for chat:', userId)
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('💬 Chat user loaded:', user.firstName, user.lastName)
    console.log('📸 Photo available for chat:', user.photo ? 'Yes' : 'No')

    res.json({
      message: 'User profile fetched successfully',
      data: user
    });
  } catch (err) {
    console.error('❌ Chat user fetch error:', err.message)
    res.status(400).send('ERROR: ' + err.message);
  }
});

module.exports = chatRouter;