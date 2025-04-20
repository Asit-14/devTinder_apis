const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth') // ✅ Fix path


// GET: Profile (Protected route)
profileRouter.get('/profile', userAuth, async (req, res) => {
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


module.exports = profileRouter;