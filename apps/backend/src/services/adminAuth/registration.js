const bcrypt = require("bcryptjs");
const { Token } = require("../tokenManagement");
const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class Registration extends Manager {
  constructor() {
    super();
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

    // Check if the email ends with "@gnsurveys.co.uk"
    if (!email.endsWith("@imssystems.tech")) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Only email addresses ending with @imssystems.co.uk are allowed."
      );
    }

    let admin = await this.Admin.findOne({ email });
    if (admin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "An account is already registerd with this email."
      );
    let adminAccessTokenPayload = {
      firstName,
      lastName,
      email,
    };
    const registrationToken = await Token.signToken(
      adminAccessTokenPayload,
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
    let newAdmin = new this.Admin({
      firstName,
      lastName,
      email,
      password: hashPassword,
      emailVerification: { token: registrationToken },
    });
    newAdmin = await newAdmin.save();
    let verificationLink = `${process.env.CLIENT_URL}/auth/account-verification/${registrationToken}`;
    logger.debug("account verification link: " + verificationLink);
    await sendMail("email-verification", email, {
      name: firstName,
      verificationLink,
    });
    return { admin: { _id: newAdmin._id, fullName: newAdmin.fullName } };
  }
  async verifyRegistration(token) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Registration token is required"
      );
    let validationResponse = await Token.verify(token, process.env.JWT_KEY);
    if (!validationResponse.valid) {
      if (validationResponse.expired) {
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "Token expired."
        );
      }
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Token is invalid."
      );
    }
    let { firstName, lastName, email, password } = validationResponse.decoded;
    let admin = await this.Admin.findOne({ email });
    if (!admin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Admin not found."
      );
    if (admin.emailVerification.token !== token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    admin = await this.Admin.findOneAndUpdate(
      { email },
      {
        $set: {
          firstName,
          lastName,
          email,
          emailVerification: {
            token: null,
            status: "Verified",
            verificationDate: Date.now(),
          },
        },
      },
      { new: true }
    );
    return admin;
  }
  async resendVerification(id) {
    let admin = await this.Admin.findOne({ _id: id });
    const { email, firstName, lastName } = admin;
    if (!admin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No admin found with this id."
      );
    if (admin.emailVerification.status === "Verified")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Admin is already verified."
      );
    let adminAccessTokenPayload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    logger.info("", { firstName: firstName, lastName: lastName, email: email });
    const registrationToken = await Token.signToken(
      adminAccessTokenPayload,
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!registrationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Registration token could not be signed."
      );
    await this.Admin.updateOne(
      { _id: id },
      {
        $set: { emailVerification: { token: registrationToken } },
      }
    );
    let verificationLink = `${process.env.CLIENT_URL}/accounts/registration-verification/?registration_token=${registrationToken}`;
    await sendMail("email-verification", email, {
      name: admin.firstName,
      verificationLink,
    });
    return { _id: admin._id, fullName: admin.fullName };
  }
}
module.exports = { Registration };
