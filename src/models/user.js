const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 15,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,

      validate(value) {
        const allowedGenders = ['male', 'female', 'other']
        if (!allowedGenders.includes(value.toLowerCase())) {
          throw new Error("Gender must be 'male', 'female', or 'other'")
        }
      },
    },
    about: {
      type: String,
      default: 'This is default about....',
    },
    photo: {
      type: String,
      default: './src/Public/User.jpeg',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('User', userSchema)
module.exports = User
