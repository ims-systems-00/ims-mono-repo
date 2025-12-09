const { Manager } = require("./manager");
const bcrypt = require("bcryptjs");
const { Token } = require("../tokenManagement");
const { sendMail } = require("../../email/sendMail");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class Recovery extends Manager {
  constructor() {
    super();
  }
  async startAccountRecovery(email) {
    email = email?.toLowerCase();
    let admin = await this.Admin.findOne({ email });
    const { firstName } = admin;
    if (!admin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Admin not found."
      );
    const adminAccessTokenPayload = { _id: admin._id };
    const recoveryToken = await Token.signToken(
      adminAccessTokenPayload,
      process.env.JWT_KEY,
      {
        expiresIn: 600,
      }
    );
    if (!recoveryToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Recovery token could not be signed."
      );
    let recoveryLink = `${process.env.CLIENT_URL}/auth/setuppassword/${recoveryToken}`;
    logger.debug("account recovery link: " + recoveryLink);
    await sendMail("account-recovery", email, {
      name: firstName,
      recoveryLink,
    });
    await this.Admin.updateOne(
      { email },
      {
        $set: {
          recoveryToken: recoveryToken,
        },
      }
    );
    return { email };
  }
  async recoverAccount(token, newPassword) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Recovery token is required"
      );
    let validationResponse = await Token.verify(token, process.env.JWT_KEY);
    if (!validationResponse.valid) {
      if (validationResponse.expired) {
        // await this.Admin.updateOne(
        //   { email },
        //   {
        //     $set: {
        //       recoveryToken: null,
        //     },
        //   }
        // );
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
    let { _id } = validationResponse.decoded;
    let admin = await this.Admin.findOne({ _id });
    if (!admin)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Admin not found."
      );
    if (admin.recoveryToken !== token)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Token is too old."
      );
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(newPassword, salt);
    admin = await this.Admin.findOneAndUpdate(
      { _id },
      {
        $set: {
          password: hashPassword,
          recoveryToken: null,
        },
      },
      { new: true }
    );
    return admin;
  }
}
module.exports = { Recovery };
