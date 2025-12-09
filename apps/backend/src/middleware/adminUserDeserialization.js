const { Token } = require("../services/tokenManagement");
const { APIError } = require("../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const adminDeserialization = async (req, res, next) => {
  const accessToken = req.header("x-admin-accesstoken");
  try {
    if (!accessToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "No access token found."
      );
    const validationResponse = await Token.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "Invalid access token."
      );
    }
    /** admin authenticated proceed to next middleware */
    if (validationResponse.decoded) {
      req.adminControl = {
        admin: validationResponse.decoded.admin,
      };
      return next();
    }
    logger.info("Unknown authorization error!");
    return res
      .status(440)
      .json({ message: "Unknown authorization error!", details: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = adminDeserialization;
