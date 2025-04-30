const express = require('express')
const authRouter = express.Router()
const { validateSignUpData } = require('../utils/validation')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST: Signup
authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req)
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    })
    if (existingUser) return res.status(409).send('Email already registered')

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: passwordHash,
    })

    await user.save()
    res.status(201).send('User added successfully')
  } catch (err) {
    res.status(400).send('Error saving the user: ' + err.message)
  }
})

// POST: Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).send('User not found')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res.status(401).send('Invalid credentials')

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 8 * 3600000),
    })

    res.status(200).send({ token })
  } catch (err) {
    res.status(400).send('Error logging in: ' + err.message)
  }
})

// POST: Logout
authRouter.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  })
  res.status(200).send('Logged out successfully')
})

module.exports = authRouter
