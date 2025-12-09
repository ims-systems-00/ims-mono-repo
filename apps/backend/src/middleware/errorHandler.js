const ErroHandler = require("../helpers/errors/errorHandler");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const errorHandler = async (err, req, res, next) => {
  const errorHandler = new ErroHandler(err);
  errorHandler.handleError();
  if (errorHandler.isTrustedAPIError()) {
    res.status(err.httpStatusCode).json({
      message: err.name,
      details: {
        description: err.description,
      },
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      details: {
        description:
          "This is not a trusted operational API Error. Please contact API team for troubleshooting this issue.",
      },
    });
    console.info("Restarting gracefully...");
    // process.exit(1);
  }
};

module.exports.errorHandler = errorHandler;
