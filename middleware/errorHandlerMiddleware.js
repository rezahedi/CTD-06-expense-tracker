const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  // Set default or set by custom error's values
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong.'
  }

  // Check if error comes from Mongoose and which error code is
  // Mongoose cast error
  if ( err.name === 'CastError' ) {
    customError = {
      msg: `Item not found with the id: ${err.value}`,
      statusCode: StatusCodes.NOT_FOUND,
    }
  }
  // Mongoose validation error
  if ( err.name === 'ValidationError' ) {
    customError = {
      msg: `${Object.values(err.errors).map(item=>item.message).join(', ')}`,
      statusCode: StatusCodes.BAD_REQUEST,
    }
  }
  // Mongoose duplicate error
  if ( err.code && err.code === 11000 ) {
    customError = {
      msg: `Duplicate value entered for unique '${Object.keys(err.keyValue)[0]}' field, please use different value.`,
      statusCode: StatusCodes.BAD_REQUEST,
    }
  }
  
  return res.status( customError.statusCode ).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
