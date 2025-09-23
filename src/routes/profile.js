const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require('../middlewares/auth') // ✅ Fix path
const { validateEditProfileData } = require('../utils/validation')

// GET: Profile (Protected route)
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(404).send('User not found')
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(401).send('Error: ' + err.message)
  }
})

// PATCH: Edit Profile (Protected route)
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit request')
    }

    const loggedInUser = req.user
    
    // Log the photo data to debug
    if (req.body.photo) {
      console.log('📸 Photo update received:', req.body.photo.substring(0, 50) + '...')
    }

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save()
    
    console.log('✅ Profile updated for user:', loggedInUser.firstName)
    
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    })
  } catch (err) {
    console.error('❌ Profile update error:', err.message)
    res.status(400).send('ERROR: ' + err.message)
  }
})

// DELETE: Delete Account (Protected route)
profileRouter.delete('/profile/delete', userAuth, async (req, res) => {
  try {
    const user = req.user
    const User = require('../models/user')
    const { ConnectionRequestModel } = require('../models/connectionRequest')
    
    console.log('🗑️ Deleting account for user:', user.firstName)
    
    // Delete all connection requests involving this user
    await ConnectionRequestModel.deleteMany({
      $or: [
        { fromUserId: user._id },
        { toUserId: user._id }
      ]
    })
    
    console.log('✅ Connection requests deleted')
    
    // Delete the user account
    await User.findByIdAndDelete(user._id)
    
    console.log('✅ User account deleted successfully')
    
    res.status(200).json({
      message: 'Account deleted successfully'
    })
  } catch (err) {
    console.error('❌ Account deletion error:', err.message)
    res.status(400).send('ERROR: ' + err.message)
  }
})

module.exports = profileRouter
