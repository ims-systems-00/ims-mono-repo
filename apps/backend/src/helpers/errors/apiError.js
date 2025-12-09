const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class APIError extends Error {
  constructor(
    name = ReasonPhrases.INTERNAL_SERVER_ERROR,
    httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description = ReasonPhrases.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(description);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.description = description;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
module.exports = { APIError };
