const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI) // No options needed anymore
    console.log('MongoDB Connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
  }
}

module.exports = connectDB
