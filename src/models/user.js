const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt') // Prefer bcrypt over bcryptjs
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index :true,
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
        validator: validator.isEmail,
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: validator.isStrongPassword,
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
      default: '/public/User.jpeg',
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Instance method to generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || 'techasiti', {
    expiresIn: '7d',
  })
}

// Instance method to validate password
userSchema.methods.validatePassword = function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User
