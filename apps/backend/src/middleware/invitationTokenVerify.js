const { Token } = require("../services/tokenManagement/token");
const { APIError } = require("../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const UserModel = require("../models/mongodb/system/users&auth/user");

const verifyInvitationToken = async (req, res, next) => {
  const invitationToken = req.header("x-invitation-token");
  let User = UserModel(req.accessControl);
  try {
    /**
     * check x-invitation-token from req.header
     * then decode it using Token.verify
     * after decoding it will get email, role and org_id
     * then it will also decode x-access-token and get id
     * from this it will query user by id
     * and then get email by id
     * and finally check email from x-invitation-token with gotten email from users id query
     */

    if (!invitationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "No invitation token found."
      );

    const validationInvitationToken = await Token.verify(
      invitationToken,
      process.env.JWT_KEY
    );

    if (!validationInvitationToken || !validationInvitationToken.decoded) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired invitation token."
      );
    }

    // Extract email, role, and org_id from the decoded token
    const { email } = validationInvitationToken.decoded;

    if (!validationInvitationToken.valid) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired invitation token."
      );
    }

    // Extract user ID from the decoded access token
    const userId = req.accessControl.user._id;

    const user = await User.findOne({ _id: userId });
    if (user.email !== email) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "This user is not allowed to access this invitation."
      );
    }

    // If all checks pass, call the next middleware
    return next();
  } catch (error) {
    // Handle any errors and pass them to the error-handling middleware
    next(error);
  }
};

module.exports = verifyInvitationToken;
