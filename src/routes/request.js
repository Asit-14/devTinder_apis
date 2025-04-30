const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { ConnectionRequestModel } = require('../models/connectionRequest') // Added missing import

// POST: Send connection request
requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status =  req.params.status;

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      })

      const data = await connectionRequest.save()

      res.json({
        message: 'Connection request sent successfully',
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
