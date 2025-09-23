const express = require('express')
const userRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { ConnectionRequestModel } = require('../models/connectionRequest')
const User = require('../models/user')

// GET: User connections
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', ['firstName', 'lastName', 'photo', 'age', 'about', 'skills'])
      .populate('toUserId', ['firstName', 'lastName', 'photo', 'age', 'about', 'skills'])

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })

    console.log('🔗 Connections fetched for:', loggedInUser.firstName)
    console.log('📊 Number of connections:', data.length)
    
    res.json({ message: 'Connections fetched successfully', data })
  } catch (err) {
    console.error('❌ Connections fetch error:', err.message)
    res.status(400).json({ message: 'ERROR: ' + err.message })
  }
})

// GET: User pending requests
userRouter.get('/user/requests', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', [
      'firstName',
      'lastName',
      'photo',
      'age',
      'about',
      'skills',
    ])

    res.json({
      message: 'Pending requests fetched successfully',
      data: connectionRequests,
    })
  } catch (err) {
    res.status(400).json({ message: 'ERROR: ' + err.message })
  }
})

// GET: User feed
userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit

    // Find all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId')

    const hideUsersFromFeed = new Set()
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString())
      hideUsersFromFeed.add(req.toUserId.toString())
    })

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select('firstName lastName photo age about skills')
      .skip(skip)
      .limit(limit)

    res.json({ message: 'Feed fetched successfully', data: users })
  } catch (err) {
    res.status(400).json({ message: 'ERROR: ' + err.message })
  }
})

// GET: View specific user profile
userRouter.get('/user/profile/:userId', userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require('mongoose');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('firstName lastName photo age about skills gender email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('👤 Profile viewed:', user.firstName, user.lastName)
    console.log('📸 Photo data available:', user.photo ? 'Yes' : 'No')

    res.json({
      message: 'User profile fetched successfully',
      data: user
    });
  } catch (err) {
    console.error('❌ Profile view error:', err.message)
    res.status(400).json({ message: 'ERROR: ' + err.message });
  }
})

// GET: Check if users can chat (are they connected?)
userRouter.get('/user/canChat/:userId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;
    const mongoose = require('mongoose');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if there's an accepted connection between these users
    const connection = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: userId, status: 'accepted' },
        { fromUserId: userId, toUserId: loggedInUser._id, status: 'accepted' }
      ]
    });

    console.log('🔍 Chat permission check:', loggedInUser.firstName, 'to user', userId)
    console.log('✅ Can chat:', connection ? 'Yes' : 'No')

    res.json({
      canChat: !!connection,
      message: connection ? 'Users are connected and can chat' : 'Users are not connected'
    });
  } catch (err) {
    console.error('❌ Chat permission error:', err.message)
    res.status(400).json({ message: 'ERROR: ' + err.message });
  }
})

module.exports = userRouter
