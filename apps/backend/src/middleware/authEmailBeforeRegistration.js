const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { deepValidateEmail } = require("../helpers/deepValidateEmail");
const { APIError } = require("../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const authEmailBeforeRegistration = async (req, res, next) => {
  try {
    let results = await deepValidateEmail(req.body.email);
    if (results.isDisposable)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Flagged as disposable email."
      );
    // if (results.isFree)
    //   throw new APIError(
    //     ReasonPhrases.BAD_REQUEST,
    //     StatusCodes.BAD_REQUEST,
    //     "Flagged as disposable email."
    //   );

    logger.info(
      "validation results of email to be registered: " + req.body.email,
      results
    );

    if (!results.validMx)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid email domain."
      );
    if (!results.validFormat)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid email format."
      );

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authEmailBeforeRegistration };
