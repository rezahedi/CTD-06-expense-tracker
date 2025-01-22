require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('../errors')

const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization
  if ( !authHeader || !authHeader.startsWith('Bearer ') ) {
    throw new AuthenticationError('Authentication not provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user to the authorized route
    const user = await User.findById(payload.userId).select('-password')
    req.user = { userId: user._id, name: user.name }

    next()
    
  } catch (error) {
    throw new AuthenticationError('Invalid authentication')
  }
}

module.exports = authMiddleware