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

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save()
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    })
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message)
  }
})

module.exports = profileRouter
