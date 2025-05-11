const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { ConnectionRequestModel } = require('../models/connectionRequest')
const User = require('../models/user')

// POST: Send connection request
requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      // Validate status
      const allowedStatus = [
        'accepted',
        'rejected',
        'ignored',
        'interested',
      ]
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status type: ' + status })
      }

      // Prevent sending request to self
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: 'Cannot send request to yourself' })
      }

      // Check if target user exists
      const toUser = await User.findById(toUserId)
      if (!toUser) {
        return res.status(404).json({ message: 'User not found!' })
      }

      // Check for existing connection request in either direction
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })

      if (existingConnectionRequest) {
        return res.status(409).json({
          message: 'Connection request already exists between these users.',
        })
      }

      // Create new connection request
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      })

      const data = await connectionRequest.save()

      res.status(201).json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      })
    } catch (err) {
      res
        .status(500)
        .send('Error processing connection request: ' + err.message)
    }
  },
)

module.exports = requestRouter
