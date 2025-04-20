require('dotenv').config() // ✅ Load env variables first
const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')

const app = express()

// ✅ Middleware
app.use(express.json())
app.use(cookieParser())



const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
