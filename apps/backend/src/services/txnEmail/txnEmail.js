const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { Token } = require("../tokenManagement");
const { sendMail } = require("../../email/sendMail");

class txnEmailService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createtxnEmail(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    // email ache and verified, throw error
    // email ache kintu not verified, just send email

    // Check for any document with the same email
    let exist = await this.txnEmail.findOne({
      email: data.email,
    });
    if (exist) {
      if (exist.isEmailVerified) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "An account is already registered with this email."
        );
      } else {
        // Optionally, resend verification or handle as you wish
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "A verification email has already been sent to this address."
        );
      }
    }
    let newtxnEmail = new this.txnEmail({
      email: data.email,
      organization: this.connection.user.organizationId,
    });
    newtxnEmail = await newtxnEmail.save();

    let token = await Token.signToken(
      {
        email: data.email,
        organization: this.connection.user.organizationId,
      },
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!token)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Token could not be signed."
      );
    let verificationLink = `${process.env.CLIENT_URL}/auth/txl-email/verify/${token}`;

    await sendMail("txn-email-invitation", data.email, {
      senderOrganizationName: this.connection.user.organizationName,
      verificationLink,
    });

    return newtxnEmail;
  }
  async gettxnEmail(query) {
    let exist = await this.txnEmail.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Txl Email not found with given query."
      );
    return exist;
  }

  async listtxnEmail(query, options) {
    const aggregate = this.txnEmail.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.txnEmail.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }

  async hardRemovetxnEmail(id) {
    const txnEmail = await this.gettxnEmail({ _id: id });
    if (txnEmail) {
      await this.txnEmail.deleteOne({ _id: id });
      return txnEmail;
    }
  }
}

module.exports = { txnEmailService };
