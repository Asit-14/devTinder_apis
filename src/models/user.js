const mongoose = require('mongoose')
const validator = require('validator') // Use 'validator' package

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
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          'Password must include uppercase, lowercase, number, and symbol',
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) =>
          ['male', 'female', 'other'].includes(value.toLowerCase()),
        message: "Gender must be 'male', 'female', or 'other'",
      },
    },
    about: {
      type: String,
      default: 'This is default about....',
    },
    photo: {
      type: String,
      default: './src/Public/User.jpeg',
      // validate: {
      //   validator: (value) => validator.isURL(value),
      //   message: 'Invalid photo URL format',
      // },
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
