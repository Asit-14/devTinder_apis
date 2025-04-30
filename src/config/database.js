const mongoose = require('mongoose')

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI) // No options needed anymore
}

module.exports = connectDB
