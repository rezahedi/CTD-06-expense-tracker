const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  // Set default or set by custom error's values
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong.'
  }

  // Check if error comes from Mongoose and which error code is
  // 11000 = Duplicate value for unique field
  if ( err.code && err.code === 11000 ) {
    customError = {
      msg: `Duplicate value entered for unique '${Object.keys(err.keyValue)[0]}' field, please use different value.`,
      statusCode: StatusCodes.BAD_REQUEST,
    }
  }
  
  // return res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json({ err })
  return res.status( customError.statusCode ).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
