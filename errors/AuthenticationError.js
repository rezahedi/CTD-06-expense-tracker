const { StatusCodes } = require('http-status-codes');
const CustomError = require('./CustomError');

class AuthenticationError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthenticationError;
