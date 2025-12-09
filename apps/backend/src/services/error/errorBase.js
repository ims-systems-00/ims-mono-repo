const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class ErroBase extends Error {
  constructor(
    name = ReasonPhrases.INTERNAL_SERVER_ERROR,
    httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description = ReasonPhrases.INTERNAL_SERVER_ERROR,
    isOperational = false
  ) {
    this.name = name
    this.httpStatusCode = httpStatusCode
    this.description = description
    this.isOperational = isOperational
    super(description)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
module.exports = ErroBase;
