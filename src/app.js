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
    res.status(400).send('Error saving the user: ' + err.message)
  }
})

// GET: API to find the user by email
app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email })
    if (!user) {
      return res.status(404).send('User not found')
    }
    res.send(user)
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

// DELETE: API to delete a user by ID
app.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) {
      return res.status(404).send('User not found')
    }
    res.status(200).send('User deleted successfully')
  } catch (err) {
    res.status(500).send('Error deleting user: ' + err.message)
  }
})

// PATCH: API to update a user by ID
app.patch('/user/:userId', async (req, res) => {
  const updates = req.body
  const allowedUpdates = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'about',
    'photo',
    'skills',
  ]

  // Check if all updates are allowed
  const isUpdateAllowed = Object.keys(updates).every((key) =>
    allowedUpdates.includes(key)
  )

  if (!isUpdateAllowed) {
    return res.status(400).send('Invalid update fields')
  }

  // Custom check for skills array length
  if (updates.skills && Array.isArray(updates.skills) && updates.skills.length > 10) {
    return res.status(400).send('Skills should be less than or equal to 10')
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      {
        new: true,
        runValidators: true, // ensures Mongoose schema validations are applied
      }
    )

    if (!updatedUser) {
      return res.status(404).send('User not found')
    }

    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(400).send('Error updating user: ' + err.message)
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
