const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  // TODO: Log the error in development mode!
  console.log(err)
  
  return res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json({ err })
}

module.exports = errorHandlerMiddleware
