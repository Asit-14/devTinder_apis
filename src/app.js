require('dotenv').config();
const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002'], // React app URLs
  credentials: true
}))
// Increase body parser limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Routers
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', chatRouter)

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log('🔗 Database connection established')
    app.listen(3000, () => {
      console.log('🚀 Server is running on port 3000')
      console.log('💕 DevTinder Backend API is ready!')
      console.log('📱 Frontend should be running on port 3001')
      console.log('🌐 Using MongoDB Atlas cloud database')
    })
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message)
    console.log('🔄 Starting server anyway for demo purposes...')
    app.listen(3000, () => {
      console.log('🚀 Server is running on port 3000 (without database)')
      console.log('⚠️  Database features will not work until connection is established')
    })
  })
