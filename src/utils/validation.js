const validator = require('validator')

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error('Name is not valid')
  }

  if (!validator.isEmail(email)) {
    throw new Error('Please enter a valid email address')
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be strong (include uppercase, lowercase, number, and symbol)',
    )
  }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'email',
    'photo',
    'about',
    'gender',
    'skills',
  ]

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  )
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
}
