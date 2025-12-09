const { ImsProjectWorkPackage } = require("./imsProjectWorkPackage");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "assignedTo",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
];
class ImsProjectWorkPackageAssignment extends ImsProjectWorkPackage {
  constructor(connection) {
    super(connection);
  }

  async createImsProjectWorkPackageAssignment(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    await this.getImsProjectWorkPackage({
      _id: data.imsProjectWorkPackage,
      imsProjectId: data.imsProjectId,
    });

    const promises = data.assignedTo.map(async (assignedToItem) => {
      let newImsProjectWorkPackageAssignment =
        new this.ImsProjectWorkPackageAssignment({
          imsProjectId: data.imsProjectId,
          imsProjectWorkPackage: data.imsProjectWorkPackage,
          assignedTo: new mongoose.Types.ObjectId(assignedToItem), // Convert string to ObjectId
          organization: this.connection.user.organizationId,
        });

      newImsProjectWorkPackageAssignment =
        await newImsProjectWorkPackageAssignment.save();
      return newImsProjectWorkPackageAssignment.populate(population);
    });

    return Promise.all(promises);
  }

  async getImsProjectWorkPackageAssignment(query) {
    let exist = await this.ImsProjectWorkPackageAssignment.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project work package assignment not found with given query."
      );
    return exist.populate(population);
  }
  async listImsProjectWorkPackageAssignment(query, options) {
    const pagination = await this.ImsProjectWorkPackageAssignment.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );
    return pagination;
  }
  async hardRemoveImsProjectWorkPackageAssignment(id) {
    const imsProjectWorkPackageAssignment =
      await this.getImsProjectWorkPackageAssignment({
        _id: id,
      });
    if (imsProjectWorkPackageAssignment) {
      await this.ImsProjectWorkPackageAssignment.deleteOne({ _id: id });
      return imsProjectWorkPackageAssignment;
    }
  }
}

module.exports = { ImsProjectWorkPackageAssignment };
