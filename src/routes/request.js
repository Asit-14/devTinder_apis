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

      const allowedStatus = ['accepted', 'rejected', 'ignored', 'interested']
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status type: ' + status })
      }

      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: 'Cannot send request to yourself' })
      }

      const toUser = await User.findById(toUserId)
      if (!toUser) {
        return res.status(404).json({ message: 'User not found!' })
      }

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

// ✅ POST: Review connection request (accept or reject)
requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user
      const { status, requestId } = req.params

      const allowedStatus = ['accepted', 'rejected']
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Status not valid' })
      }

      // console.log('LoggedInUser ID:', loggedInUser._id)
      // console.log('Reviewing requestId:', requestId, 'with status:', status)

      // ✅ Use the correct model name
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      })

      if (!connectionRequest) {
        return res.status(404).json({
          message: 'Connection Request not found',
          hint: 'Check if requestId and toUserId match and status is "interested"',
        })
      }

      connectionRequest.status = status
      const data = await connectionRequest.save()

      res.json({
        message: `Connection request ${status}`,
        data,
      })
    } catch (err) {
      console.error('Error in review route:', err.message)
      res.status(500).json({ message: 'ERROR: ' + err.message })
    }
  },
)


module.exports = requestRouter
