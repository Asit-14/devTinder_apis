const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

// POST: Signup route for adding a new user
app.post('/signup', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send('User added successfully')
  } catch (err) {
    res.status(500).send('Error saving the user: ' + err.message)
  }
})

// GET: API to find the user by email
app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email })
    if (!user) {
      return res.status(404).send('User not found')
    } else {
      res.send(user)
    }
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

// GET: Feed API for getting all users from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (err) {
    res.status(500).send('Error fetching users: ' + err.message)
  }
})

// api for deleting a user by id
app.delete('/user', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) {
      return res.status(404).send('User not found')
    }
    res.send('User deleted successfully')
  } catch (err) {
    res.status(500).send('Error deleting user: ' + err.message)
  }
})


// api for updating a user by id
app.patch('/user', async (req, res) => {
  const { userId, ...updates } = req.body

  if (!userId) {
    return res.status(400).send('User ID is required')
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,

    })
    if (!updatedUser) {
      return res.status(404).send('User not found')
    }
    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(500).send('Error updating user: ' + err.message)
  }
})




// Connect to DB and start server
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
