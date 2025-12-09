const { ImsProjectWorkPackage } = require("./imsProjectWorkPackage");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "parentWorkPackage",
    select: "title description createdAt",
  },
  { path: "childWorkPackage", select: "title description createdAt" },
  { path: "blockingWorkPackage", select: "title description createdAt" },
  { path: "waitingWorkPackage", select: "title description createdAt" },
];
class ImsProjectWorkPackageRelationship extends ImsProjectWorkPackage {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectWorkPackageRelationship(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    console.log(
      data,
      data.childWorkPackage === data.parentWorkPackage,
      data.blockingWorkPackage === data.waitingWorkPackage
    );

    if (
      (data.childWorkPackage &&
        data.parentWorkPackage &&
        data.childWorkPackage === data.parentWorkPackage) ||
      (data.blockingWorkPackage &&
        data.waitingWorkPackage &&
        data.blockingWorkPackage === data.waitingWorkPackage)
    ) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Relationship id must be different."
      );
    }

    let creatable = {
      ...data,
      organization: this.connection.user.organizationId,
    };

    let exists = await this.ImsProjectWorkPackageRelationship.findOne(
      creatable
    );
    if (exists)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A relationship already exists."
      );

    await this.getImsProjectWorkPackage({
      _id: data.parentWorkPackage || data.blockingWorkPackage,
    });

    let newImsProjectWorkPackageRelationship =
      new this.ImsProjectWorkPackageRelationship(creatable);

    newImsProjectWorkPackageRelationship =
      await newImsProjectWorkPackageRelationship.save();
    return newImsProjectWorkPackageRelationship.populate(population);
  }

  async getImsProjectWorkPackageRelationship(query) {
    let exist = await this.ImsProjectWorkPackageRelationship.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project work package relationship not found with given query."
      );
    return exist.populate(population);
  }
  async listImsProjectWorkPackageRelationship(query, options) {
    const pagination =
      await this.ImsProjectWorkPackageRelationship.paginateByOrg(
        this.connection.user.organizationId,
        query,
        { ...options, populate: population }
      );
    return pagination;
  }
  async hardRemoveImsProjectWorkPackageRelationship(id) {
    const imsProjectWorkPackageRelationship =
      await this.getImsProjectWorkPackageRelationship({
        _id: id,
      });
    if (imsProjectWorkPackageRelationship) {
      await this.ImsProjectWorkPackageRelationship.deleteOne({ _id: id });
      return imsProjectWorkPackageRelationship;
    }
  }
}

module.exports = { ImsProjectWorkPackageRelationship };
