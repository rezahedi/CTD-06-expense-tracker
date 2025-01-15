const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, AuthenticationError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()

  res.status( StatusCodes.CREATED ).json({ user: {name: user.name}, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if ( !email || !password ) {
    throw new BadRequestError('Email or Password not provided')
  }
  
  const user = await User.findOne({email})
  if ( !user ) {
    throw new AuthenticationError('User invalid')
  }
  
  const isPasswordMatched = await user.comparePassword(password)
  if ( !isPasswordMatched ) {
    throw new AuthenticationError('Password invalid')
  }

  const token = user.createJWT()
  res.status( StatusCodes.OK ).json({ user: {name: user.name}, token })
}

module.exports = {
  register,
  login,
}