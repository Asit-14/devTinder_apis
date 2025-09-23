const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'devTinder' // Specify the database name for Atlas
    })
    console.log('🌟 MongoDB Atlas Connected Successfully')
    console.log('📊 Database: devTinder')
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message)
    console.log('🔧 Please check your MongoDB Atlas connection string and network access')
    // Don't exit the process, just continue without DB for demo purposes
  }
}

module.exports = connectDB
