const bcrypt = require("bcryptjs");
const { Token } = require("../tokenManagement");
const { Manager } = require("./manager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { sendMail } = require("../../email/sendMail");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);

const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class RegistrationService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async startRegistration(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let { firstName, lastName, email, password } = data;
    email = email.toLowerCase();
    let user = await this.Users.findOne({ email });
    if (user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "An account is already registerd with this email."
      );
    let accessTokenPayload = {
      firstName,
      lastName,
      email,
    };
    const registrationToken = await Token.signToken(
      accessTokenPayload,
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!registrationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Registration token could not be signed."
      );
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    let verificationLink = `${
      data.clientUrl || process.env.CLIENT_URL
    }/auth/account-verification/${registrationToken}`;
    logger.debug("email verification link: " + verificationLink);
    let newUser = new this.Users({
      firstName,
      lastName,
      email,
      password: hashPassword,
      name: firstName + " " + lastName,
      emailVerificationToken: registrationToken,
      verificationEmailAfter: Date.now() + 1000 * 120,
    });
    newUser = await newUser.save();
    await sendMail("email-verification", email, {
      name: firstName,
      verificationLink,
    });
    return { user: { _id: newUser._id, name: newUser.name } };
  }
  async startUserVerification(user) {
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "An account is not registerd with this email."
      );

    let { firstName, lastName, email } = user;
    let accessTokenPayload = {
      firstName,
      lastName,
      email,
    };
    const registrationToken = await Token.signToken(
      accessTokenPayload,
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!registrationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Registration token could not be signed."
      );
    let verificationLink = `${
      data.clientUrl || process.env.CLIENT_URL
    }/auth/account-verification/${registrationToken}`;
    logger.debug("email verification link: " + verificationLink);
    await this.Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          emailVerificationToken: registrationToken,
          verificationEmailAfter: Date.now() + 1000 * 120,
        },
      }
    );
    await sendMail("email-verification", email, {
      name: firstName,
      verificationLink,
    });
    return { user: { _id: user._id, name: user.name } };
  }
  async emailValidation(data) {
    try {
      const request = {
        url: "/v3/validation/email",
        method: "POST",
        body: data,
      };
      let response = await sgClient.request(request);
      logger.info(response);
    } catch (err) {
      logger.info(err);
    }
  }
  async verifyRegistration() {}
  async getLimitedAccessToken(payload) {
    return Token.signToken({ ...payload }, process.env.JWT_KEY, {
      expiresIn: 50,
    });
  }
}
module.exports = { RegistrationService };
