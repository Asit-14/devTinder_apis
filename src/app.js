const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

app.post('/signup', async (req, res) => {
  // creating a new instance of the user model
  const user = new User({
    firstName: 'Asit',
    lastName: 'Kumar', // corrected casing
    email: 'asitshakya789@gmail.com',
    password: 'iloveyou',
  })

  try {
    await user.save()
    res.status(201).send('User added successfully')
  } catch (err) {
    res.status(500).send('Error saving the user: ' + err.message)
  }
})

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
