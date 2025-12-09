const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class CcCarbonReductionInitiative extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCcCarbonReductionInitiative(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    let {
      title,
      description,
      implementedAt,
      identifiedAt,
      assignedTo,
      attachments,
      priority,
      potentialCoBenefits,
      potentialUnintendedConsequences,
    } = data;

    let newCcCarbonReductionInitiative = new this.CcCarbonReductionInitiative({
      title,
      description,
      implementedAt,
      identifiedAt,
      assignedTo,
      attachments,
      priority,
      potentialCoBenefits,
      potentialUnintendedConsequences,
      createdBy: this.connection.user?._id,
      organization: this.connection.user.organizationId,
    });

    newCcCarbonReductionInitiative =
      await newCcCarbonReductionInitiative.save();

    return newCcCarbonReductionInitiative.populate(population);
  }

  async getCcCarbonReductionInitiative(query) {
    let exist = await this.CcCarbonReductionInitiative.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc carbon reduction initiative not found with given query."
      );
    return exist.populate(population);
  }
  async updateCcCarbonReductionInitiative(id, data) {
    await this.getCcCarbonReductionInitiative({ _id: id });
    let updatedCcCarbonReductionInitiative =
      await this.CcCarbonReductionInitiative.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...data,
          },
        },
        { new: true }
      );
    updatedCcCarbonReductionInitiative =
      await updatedCcCarbonReductionInitiative.populate(population);
    return updatedCcCarbonReductionInitiative;
  }
  async listCcCarbonReductionInitiative(query, options) {
    const aggregate = this.CcCarbonReductionInitiative.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.CcCarbonReductionInitiative.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async updateCcCarbonReductionInitiativeAttachments(id, data) {
    await this.getCcCarbonReductionInitiative({ _id: id });
    let ccCarbonReductionInitiativeAttachments =
      await this.CcCarbonReductionInitiative.findOneAndUpdate(
        { _id: id },
        { $push: { attachments: { $each: data.attachments } } },
        { new: true }
      );
    ccCarbonReductionInitiativeAttachments =
      await ccCarbonReductionInitiativeAttachments.populate(population);
    return ccCarbonReductionInitiativeAttachments;
  }
  async deleteCcCarbonReductionInitiativeAttachments(
    initiativeId,
    attachmentId
  ) {
    await this.getCcCarbonReductionInitiative({ _id: initiativeId });
    let ccCarbonReductionInitiativeAttachments =
      await this.CcCarbonReductionInitiative.findOneAndUpdate(
        { _id: initiativeId },
        { $pull: { attachments: { _id: attachmentId } } },
        { new: true }
      );
    ccCarbonReductionInitiativeAttachments =
      await ccCarbonReductionInitiativeAttachments.populate(population);
    return ccCarbonReductionInitiativeAttachments;
  }

  async updateCcCarbonReductionInitiativeAssignedUsers(id, data) {
    await this.getCcCarbonReductionInitiative({ _id: id });
    const existInitiativeUser = await this.CcCarbonReductionInitiative.findOne({
      _id: id,
      assignedTo: { $in: [...data.assignedTo] },
    });
    if (existInitiativeUser) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User already assigned to this initiative."
      );
    }
    let ccCarbonReductionInitiativeAssignedUsers =
      await this.CcCarbonReductionInitiative.findOneAndUpdate(
        { _id: id },
        { $push: { assignedTo: { $each: data.assignedTo } } },
        { new: true }
      );
    ccCarbonReductionInitiativeAssignedUsers =
      await ccCarbonReductionInitiativeAssignedUsers.populate(population);
    return ccCarbonReductionInitiativeAssignedUsers;
  }
  async deleteCcCarbonReductionInitiativeAssignedUser(initiativeId, userId) {
    console.log("user id is", userId);
    await this.getCcCarbonReductionInitiative({ _id: initiativeId });
    let ccCarbonReductionInitiativeAssignedUsers =
      await this.CcCarbonReductionInitiative.findOneAndUpdate(
        { _id: initiativeId },
        {
          $pull: { assignedTo: userId },
        },
        { new: true }
      );
    ccCarbonReductionInitiativeAssignedUsers =
      await ccCarbonReductionInitiativeAssignedUsers.populate(population);
    return ccCarbonReductionInitiativeAssignedUsers;
  }

  async softRemoveCcCarbonReductionInitiative(id) {
    const ccCarbonReductionInitiative = this.getCcCarbonReductionInitiative({
      _id: id,
    });
    if (ccCarbonReductionInitiative) {
      await this.CcCarbonReductionInitiative.softDelete({ _id: id });
      return ccCarbonReductionInitiative;
    }
  }
  async restoreCcCarbonReductionInitiative(id) {
    const ccCarbonReductionInitiative =
      await this.getCcCarbonReductionInitiative({ _id: id });
    if (ccCarbonReductionInitiative) {
      await this.CcCarbonReductionInitiative.restore({ _id: id });
      return ccCarbonReductionInitiative;
    }
  }
  async hardRemoveCcCarbonReductionInitiative(id) {
    const ccCarbonReductionInitiative =
      await this.getCcCarbonReductionInitiative({ _id: id });
    if (ccCarbonReductionInitiative) {
      await this.CcCarbonReductionInitiative.deleteOne({ _id: id });
      return ccCarbonReductionInitiative;
    }
  }
}

module.exports = { CcCarbonReductionInitiative };
