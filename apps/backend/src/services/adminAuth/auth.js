const { Manager } = require("./manager");
const bcrypt = require("bcryptjs");
const { Token } = require("../tokenManagement");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class Auth extends Manager {
  constructor() {
    super();
  }
  async authenticateIdentity({ availableToken, email, password, userAgent }) {
    email = email?.toLowerCase();
    if (!email || !password)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Email & Password are required."
      );
    const admin = await this.Admin.findOne({ email });
    if (!admin)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Admin not registered with this email."
      );
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid credentials."
      );
    await this.Session.create({ user: admin._id, userAgent });
    const newTokenPair = await this.getTokenPair(
      {
        admin: {
          _id: admin._id,
          name: admin.name,
        },
      },
      {
        admin: {
          _id: admin._id,
          name: admin.name,
        },
      }
    );
    const newAdminRefreshTokens = !availableToken
      ? [...admin.adminRefreshTokens]
      : admin.adminRefreshTokens?.filter((rt) => rt !== availableToken);
    admin.adminRefreshTokens = [...newAdminRefreshTokens, newTokenPair.adminRefreshToken];
    await admin.save();
    return { ...newTokenPair, admin: { _id: admin._id, name: admin.name } };
  }
  async getTokenPair(adminAccessTokenPayload, adminRefreshTokenPayload) {
    const adminAccessToken = await Token.signToken(
      adminAccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );
    const adminRefreshToken = await Token.signToken(
      adminRefreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );
    return { adminAccessToken, adminRefreshToken };
  }
  async handleRefreshToken(adminRefreshToken) {
    /**
     * PROBLEM: what if user is deleted and tokens are still valid.
     */
    if (!adminRefreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundAdmin = await this.Admin.findOne({
      adminRefreshTokens: adminRefreshToken,
    });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundAdmin) {
      const validationResponse = await Token.verify(
        adminRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!validationResponse.valid)
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "Invalid refresh token"
        );
      logger.info(
        "Refresh token reuse atempt detected, protecting hacked admin..."
      );
      const hackedAdmin = await this.Admin.findOne({
        _id: validationResponse.decoded.admin._id,
      });
      hackedAdmin.adminRefreshTokens = [];
      const result = await hackedAdmin.save();
      logger.info("Printing admin information...", { result });
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Reuse of refresh token."
      );
    }

    /**
     * Evaluation of refresh token to execute a token pair iteration.
     */
    const newAdminRefreshTokenArray = foundAdmin.adminRefreshTokens.filter(
      (rt) => rt !== adminRefreshToken
    );
    const validationResponse = await Token.verify(
      adminRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      foundAdmin.adminRefreshTokens = [...newAdminRefreshTokenArray];
      const result = await foundAdmin.save();
      logger.info("Refresh token expired, login required.", result);
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Refresh token expired, login required."
      );
    }
    if (
      foundAdmin._id?.toString() !==
      validationResponse.decoded.admin._id?.toString()
    )
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Admin id don't match with refresh token."
      );

    /**
     * Refresh token passed all checks and is still valid.
     */
    const newTokenPair = await this.getTokenPair(
      {
        admin: {
          _id: foundAdmin._id,
          name: foundAdmin.name,
        },
      },
      {
        admin: {
          _id: foundAdmin._id,
          name: foundAdmin.name,
        },
      }
    );
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundAdmin.adminRefreshTokens = [
      ...newAdminRefreshTokenArray,
      newTokenPair.adminRefreshToken,
    ];
    await foundAdmin.save();
    return { ...newTokenPair };
  }
  async invalidateRefreshToken(adminRefreshToken) {
    if (!adminRefreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundAdmin = await this.Admin.findOne({
      adminRefreshTokens: adminRefreshToken,
    });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundAdmin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    const newAdminRefreshTokenArray = foundAdmin.adminRefreshTokens.filter(
      (rt) => rt !== adminRefreshToken
    );
    foundAdmin.adminRefreshTokens = [...newAdminRefreshTokenArray];
    return foundAdmin.save();
  }
}
module.exports = { Auth };
