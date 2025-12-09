const _ = require("lodash");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const { Token } = require("../tokenManagement");
const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const mongoose = require("mongoose");
const {
  PARTNERSHIP_PROGRAM_STATUS,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");
class AuthService extends Manager {
  constructor(connection) {
    super(connection);
  }
  validateMongoId(orgId) {
    if (!orgId) return null;
    if (!mongoose.Types.ObjectId.isValid(orgId))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "invalid mongodb ObjectId"
      );
    return orgId;
  }
  async authenticateUserIdendityByEmail({ email, password }) {
    const maxAttempts = 4;
    email = email.toLowerCase();
    let user = await this.Users.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User does not exist."
      );

    if (user.badAttempts > maxAttempts) {
      await this.Users.findOneAndUpdate(
        { email },
        { $set: { badAttempts: 0, lockedUntil: Date.now() + 1000 * 60 * 5 } }
      );
      await sendMail("incorrect-login-attempt", user.email, {
        name: user.name,
      });
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Too many invalid attempts. Account is locked for an hour."
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await this.Users.findOneAndUpdate(
        { email },
        { $inc: { badAttempts: 1 } }
      );
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        `Invalid Credentials. Account will be locked after ${
          maxAttempts - user.badAttempts
        } invalid attempts.`
      );
    }
    return isMatch;
  }
  async authenticateUserIdendityByAuthCode({ authCode }) {
    if (!authCode) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Auth code is required."
      );
    }
    const validationResponse = await Token.verify(
      authCode,
      process.env.JWT_KEY
    );

    if (!validationResponse.valid) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "Invalid auth code."
      );
    }
    const email = validationResponse.decoded.email.toLowerCase();
    let user = await this.Users.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User does not exist."
      );
    return email;
  }
  async handleRefreshToken(refreshToken, data) {
    /**
     * PROBLEM: what if user is deleted and tokens are still valid.
     */
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.Users.findOne({ refreshTokens: refreshToken });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundUser) {
      const validationResponse = await Token.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!validationResponse.valid)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Invalid refresh token"
        );
      logger.info(
        "Refresh token reuse attempt detected, protecting hacked user...",
        { ...validationResponse.decoded }
      );
      const hackedUser = await this.Users.findOne({
        _id: validationResponse.decoded.user._id,
      });
      logger.info(hackedUser);
      hackedUser.refreshTokens = [];
      const result = await hackedUser.save();
      logger.info("Printing user information...", { result });
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Reuse of refresh token."
      );
    }

    /**
     * Evaluation of refresh token to execute a token pair iteration.
     */
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    const validationResponse = await Token.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      foundUser.refreshTokens = [...newRefreshTokenArray];
      const result = await foundUser.save();
      logger.info("Refresh token expired, login required.", result);
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Refresh token expired, login required."
      );
    }
    if (
      foundUser._id?.toString() !==
      validationResponse.decoded.user._id?.toString()
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User id don't match with refresh token."
      );

    /**
     * Refresh token passed all checks and is still valid.
     */
    const newTokenPair = await this.getSignature({
      user: foundUser,
      groupId: data.groupId || validationResponse.decoded.user.groupId || null,
      organizationId:
        data.organizationId ||
        validationResponse.decoded.user.organizationId ||
        null,
    });
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundUser.refreshTokens = [
      ...newRefreshTokenArray,
      newTokenPair.refreshToken,
    ];
    await foundUser.save();
    return { ...newTokenPair };
  }
  async invalidateRefreshToken(refreshToken) {
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.Users.findOne({ refreshTokens: refreshToken });
    if (!foundUser)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    foundUser.refreshTokens = [...newRefreshTokenArray];
    return foundUser.save();
  }
  async switchAccess({ user, policy_id }) {
    const foundUser = await this.Users.findOne({ _id: user._id });
    const newTokenPair = await this.getSignature({
      user: foundUser,
      policy_id,
    });
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundUser.refreshTokens = [
      ...foundUser.refreshTokens,
      newTokenPair.refreshToken,
    ];
    await foundUser.save();
    return { ...newTokenPair };
  }
  async grantAccess({ availableToken, email, userAgent }) {
    email = email.toLowerCase();
    let user = await this.Users.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Error grant access. User does not exist."
      );
    const newTokens = await this.getSignature({
      user,
      userAgent,
    });
    const newRefreshTokens = !availableToken
      ? [...user.refreshTokens]
      : user.refreshTokens?.filter((rt) => rt !== availableToken);
    user.refreshTokens = [...newRefreshTokens, newTokens.refreshToken];
    await user.save();
    return newTokens;
  }
  async getSignature(data) {
    let user = data?.user;
    let userAgent = data?.userAgent;
    /**
     * org if that user have access to. if no value provided system will detect default org.
     * if no default org found, sends null in token so atleast user can access public routes
     */
    let organizationId = this.validateMongoId(data?.organizationId || null);
    let groupId = this.validateMongoId(data?.groupId || null);
    if (
      // user.emailVerified.status === "pending" ||
      user.systemAccess.status === "Blocked" ||
      (user.systemAccess.period !== "Full time" &&
        user.systemAccess.expires < Date.now())
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Access is blocked for this user."
      );
    if (new Date(user.lockedUntil) > new Date())
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        `Account is locked until ${moment(user.lockedUntil).format(
          "DD/MM/YY hh:mm"
        )}.`
      );

    user = await this.Users.populateAll(user);
    user = _.omit(user._doc, [
      "password",
      "salary",
      "emailVerificationToken",
      "resetToken",
      "phoneOtp",
    ]);
    /** we are trying to match users access to organization if provided. */
    const membership = await this.Membership.findOne({
      invitedUserId: user._id,
      organization: organizationId,
    });
    if (groupId && !membership)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        `Invalid attempt to switch into group.`
      );
    if (membership) {
      logger.info("membership found, checking for group assignment...");
      if (groupId) {
        logger.info("processing group switch-in request...");
        groupId =
          membership.groups
            .map((g) => g.toString())
            .find((id) => id.toString() === groupId.toString()) || null;
      } else {
        logger.info(
          "no group switch-in request. processing defaults...",
          membership.groups
        );
        groupId =
          membership.groups.map((g) => g.toString())[0]?.toString() || null;
      }
    }
    const orgDetails = await this.Organisations.findOne({
      _id: membership?.organization,
    });
    const partnershipProgram = await this.PartnershipPrograms.findOne({
      userId: user._id,
      status: PARTNERSHIP_PROGRAM_STATUS.IMS_ACCEPTED,
    });
    const accessPayload = {
      // remove this later
      name: orgDetails?.name,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerification: user.emailVerified.status,
        /**
         * if membership not found users will have following values 'null' in the tokens
         * and they will be unable to access proper org api.
         */
        organizationId: membership?.organization || null,
        groupId: groupId,
        membershipId: membership?._id || null,
        organizationName: orgDetails?.name,
        role: membership?.role || null,
        partnershipProgramId: partnershipProgram?._id || null,
      },
    };

    let accessToken = await Token.signAccessToken(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );
    let refreshToken = await Token.signRefreshToken(
      {
        user: {
          _id: user._id,
          organizationId: membership?.organization || null,
          groupId,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_TTL }
    );

    let omniplexToken = await Token.signAccessToken(
      { iss: process.env.OMNIPLEX_ISS, sub: user._id },
      process.env.OMNIPLEX_TOKEN_KEY,
      { expiresIn: "5 days" }
    );

    await this.Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          "loggedIn.on": Date.now(),
          lockedUntil: null,
          badAttempts: 0,
        },
      }
    );
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
      omniplexToken,
    };
  }
  async getRedirectWithOAuthCode({ email, redirect_uri }) {
    const payload = {
      email: email.toLowerCase(),
    };
    const authCode = await Token.signToken(payload, process.env.JWT_KEY, {
      expiresIn: 1200,
    });
    const params = new URLSearchParams({ code: authCode });
    const parsedUrl = new URL(redirect_uri);
    parsedUrl.search = params.toString();
    return {
      authCode,
      redirect_uri: parsedUrl,
    };
  }
  async switchIntoOrg(userId, organizationId) {
    const foundUser = await this.Users.findOne({ _id: userId });
    if (!foundUser)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User does not exist."
      );
    const newTokenPair = await this.getSignature({
      user: foundUser,
      organizationId: organizationId,
    });
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundUser.refreshTokens = [
      ...newRefreshTokenArray,
      newTokenPair.refreshToken,
    ];
    await foundUser.save();
    return { ...newTokenPair };
  }
  async acceptTxnEmailInvitation(token) {
    const { expired, decoded } = await Token.verify(token, process.env.JWT_KEY);
    if (expired || !decoded)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "This verification has been expired."
      );
    const { email } = decoded;
    const txnEmail = await this.TxnEmails.findOne({ email });
    if (!txnEmail)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Txn email does not exist."
      );
    // now update the txn email to verified
    const updatedTxnEmail = await this.TxnEmails.findOneAndUpdate(
      { email },
      { $set: { isEmailVerified: true } },
      { new: true }
    );
    return { message: "Txn email verified successfully.", updatedTxnEmail };
  }
}
module.exports = { AuthService };
