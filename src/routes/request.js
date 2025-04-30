const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth') // ✅ Fixed path

// POST: Send connection request
requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
  try {
    const user = req.user
    if (!user) return res.status(404).send('User not found')

    // Logic for sending connection request can go here
    res.status(200).send(`${user.firstName} sent the connection request`)
  } catch (err) {
    res.status(500).send('Error processing connection request: ' + err.message)
  }
})

module.exports = requestRouter
