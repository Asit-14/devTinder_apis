const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const { validateSignUpData } = require('./utils/validation')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require('../src/middlewares/auth')

const app = express()

// ✅ Middleware
app.use(express.json())
app.use(cookieParser())
app.auth

// POST: User signup
app.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req) // You can expand this function to validate more fields
    const { firstName, lastName, email, password } = req.body

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).send('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    })

    await user.save()
    res.status(201).send('User added successfully')
  } catch (err) {
    res.status(400).send('Error saving the user: ' + err.message)
  }
})

// POST: User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // ✅ Correct variable

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // ✅ Use the 'password' variable from req.body
    const passwordMatch = await user.validatePassword(password);
    if (!passwordMatch) return res.status(401).send('Invalid credentials');

    const token = await user.getJWT(); // Your custom method to generate JWT

    // ✅ Optionally set cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send('Error logging in: ' + err.message);
  }
});


// GET /profile route
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user
    // Assuming User model is properly imported
    if (!user) {
      throw new Error('ERROR : ' + err.message)
    }

    res.send(user)
  } catch (err) {
    res.status(401).send('ERROR : ' + err.message)
  }
})

// POST: Send connection request
app.post('/sendConnectionRequest', userAuth, async (req, res) => {
  const user = req.user

  console.log('Connection Request Sent!')
  // Add your logic for sending a connection request here
  res.send(user.firstName + 'sent the  connection request')
})

// Connect to DB and start the server
connectDB()
  .then(() => {
    console.log('MongoDB Connected')
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
