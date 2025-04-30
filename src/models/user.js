const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  photo: String,
  about: String,
  gender: String,
  skills: [String],
})

module.exports = mongoose.model('User', userSchema)
