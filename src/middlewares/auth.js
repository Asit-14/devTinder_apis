const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({ error: 'Token not found' })
    }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: ' + err.message })
  }
}

module.exports = {
  userAuth,
}
