const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const sgClient = require("@sendgrid/client");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { AdminPartnershipProgram } = require("./adminPartnershipProgram");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);
class PartnershipProgram extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createpartnershipProgram(data) {
    const adminpartnershipService = new AdminPartnershipProgram(
      this.connection
    );
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    if (!this.connection.user.organizationId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not apply for a partnership program without an organisation id."
      );
    let exist = await this.PartnershipProgram.findOne({
      $or: [
        { userId: this.connection.user._id },
        { organization: this.connection.user.organizationId },
      ],
    });
    if (exist)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User or organization is already enrolled in a partnership programme."
      );
    let newPartnerhipProgram = new this.PartnershipProgram({
      userId: this.connection.user._id,
      organization: this.connection.user.organizationId,
      serviceProvision: data.serviceProvision,
      customerReach: data.customerReach,
      website: data.website,
      standards: data.standards,
      description: data.description,
    });
    newPartnerhipProgram = await newPartnerhipProgram.save();
    const foundUser = await this.User.findOne({
      _id: this.connection.user._id,
    });
    const { email, firstName } = foundUser;
    await sendMail("create-partnership", email, {
      name: firstName,
      email,
    });
    await adminpartnershipService.acceptPartnershipProgram(
      newPartnerhipProgram._id
    );
    return newPartnerhipProgram;
  }
  async getPartnershipProgram(query) {
    let exist = await this.PartnershipProgram.findOne(query).populate({
      path: "organization",
    });
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Partnership program not found with given query."
      );
    return exist;
  }
  async updatePartnershipProgramInfo(id, data) {
    let partnership = await this.getPartnershipProgram({ _id: id });
    partnership.organization = data.organizationId;
    return partnership.save();
  }
  async listParnershipProgramByUser(query, options) {
    let pagination = await this.PartnershipProgram.paginate(
      { ...query, userId: this.connection.user?._id },
      options
    );
    return pagination;
  }
  async analyticsByPartnership(id) {
    const partnership = await this.getPartnershipProgram({
      _id: id,
      userId: this.connection.user._id,
    });
    const basics = await this.Organisation.aggregate()
      .match({
        referralSource: new mongoose.Types.ObjectId(id),
      })
      .group({
        _id: null,
        totalAllocatedUsers: { $sum: "$licenses.users.allocated" },
        totalAllocatedGroups: { $sum: "$licenses.groups.allocated" },
        totalAllocatedSuperUsers: { $sum: "$licenses.superUser.allocated" },
        organisations: { $sum: 1 },
      });

    const complianceTools = await this.Organisation.aggregate()
      .match({
        referralSource: new mongoose.Types.ObjectId(id),
      })
      .group({
        _id: null,
        complianceToolsCount: { $addToSet: "$licenses.complianceTools" },
      })
      .unwind("$complianceToolsCount")
      .unwind("$complianceToolsCount")
      .group({
        _id: "$complianceToolsCount",
        count: { $sum: 1 },
      });

    const additionalModules = await this.Organisation.aggregate()
      .match({
        referralSource: new mongoose.Types.ObjectId(id),
      })
      .group({
        _id: null,
        additionalModulesCount: { $addToSet: "$licenses.additionalModules" },
      })
      .unwind("$additionalModulesCount")
      .unwind("$additionalModulesCount")
      .group({
        _id: "$additionalModulesCount",
        count: { $sum: 1 },
      });

    logger.debug("partnerhsip analytics", {
      ...basics[0],
      complianceTools,
      additionalModules,
    });

    return {
      ...basics[0],
      complianceTools,
      additionalModules,
    };
  }
}

module.exports = { PartnershipProgram };
