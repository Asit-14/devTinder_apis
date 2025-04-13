const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const { validateSignUpData } = require('./utils/validation')

const app = express()

// ✅ Middleware
app.use(express.json())

// POST: User signup
app.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req) // You can expand this function to validate more fields
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body

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
    const { email, password } = req.body;
    const user = await User.findOne({ email:email })

    if (!user) return res.status(404).send('User not found')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res.status(401).send('Invalid credentials')

    res.send('Login successful')
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
});



// GET: Find user by email
app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email })
    if (!user) return res.status(404).send('User not found')
    res.send(user)
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

// GET: Fetch all users
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (err) {
    res.status(500).send('Error fetching users: ' + err.message)
  }
})

// DELETE: Delete user by ID
app.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) return res.status(404).send('User not found')
    res.status(200).send('User deleted successfully')
  } catch (err) {
    res.status(500).send('Error deleting user: ' + err.message)
  }
})

// PATCH: Update user by ID
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

  const isUpdateAllowed = Object.keys(updates).every((key) =>
    allowedUpdates.includes(key),
  )

  if (!isUpdateAllowed) {
    return res.status(400).send('Invalid update fields')
  }

  if (
    updates.skills &&
    Array.isArray(updates.skills) &&
    updates.skills.length > 10
  ) {
    return res.status(400).send('Skills should be less than or equal to 10')
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true },
    )

    if (!updatedUser) return res.status(404).send('User not found')
    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(400).send('Error updating user: ' + err.message)
  }
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
