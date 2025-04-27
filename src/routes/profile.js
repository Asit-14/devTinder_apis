const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // ✅ Fix path
const { validate } = require("../models/user");


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


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);
    } catch (err) {
        res.send(400).send("ERROR :" + err.message);
    }
}) 

module.exports = profileRouter;