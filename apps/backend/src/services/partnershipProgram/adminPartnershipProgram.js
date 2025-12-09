const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { APIError } = require("../../helpers/errors/apiError");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  PARTNERSHIP_PROGRAM_STATUS,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");
class AdminPartnershipProgram extends Manager {
  constructor(connection) {
    super(connection);
  }
  async acceptPartnershipProgram(id) {
    const partnership = await this.PartnershipProgram.findOne({
      _id: id,
    });
    if (!partnership) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership Program not found with the given ID."
      );
    }

    if (partnership.status === PARTNERSHIP_PROGRAM_STATUS.IMS_ACCEPTED) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership Program is Already Accepted by iMS Admin."
      );
    }
    partnership.status = PARTNERSHIP_PROGRAM_STATUS.IMS_ACCEPTED;
    await partnership.save();
    const organization = await this.Organisation.findById(
      partnership.organization
    );
    organization.isPartner = true;
    await organization.save();
    const { userId } = partnership;
    const foundUser = await this.User.findOne({ _id: userId });
    const { email, firstName } = foundUser;
    await sendMail("accept-partnership", email, {
      name: firstName,
      referralCode: partnership._id,
      referralLink:
        process.env.CLIENT_URL +
        "/auth/onboard/partner?partnerCode=" +
        partnership._id,
    });
    return partnership;
  }
  async listParnershipProgram(query, options) {
    let pagination = await this.PartnershipProgram.paginate(query, options);
    return pagination;
  }
  async softRemovePartnershipProgram(id) {
    const partnership = await this.PartnershipProgram.findOne({ _id: id });
    if (!partnership) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership Program not found with the given ID."
      );
    }
    if (partnership) {
      await this.PartnershipProgram.softDelete({ _id: id });
    }
    return partnership;
  }
  async restorePartnershipProgram(id) {
    const partnership = await this.PartnershipProgram.findOne({ _id: id });
    if (!partnership) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership Program not found with the given ID."
      );
    }
    if (partnership) {
      await this.PartnershipProgram.restore({ _id: id });
      return partnership;
    }
  }
  async hardRemovePartnershipProgram(id) {
    const partnership = await this.PartnershipProgram.findOne({ _id: id });
    if (!partnership) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership Program not found with the given ID."
      );
    }
    if (partnership) {
      await this.PartnershipProgram.deleteOne({ _id: id });
    }
    return partnership;
  }
}

module.exports = { AdminPartnershipProgram };
