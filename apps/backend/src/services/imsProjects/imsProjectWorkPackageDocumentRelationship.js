const { ImsProjectWorkPackage } = require("./imsProjectWorkPackage");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "parentWorkPackage",
    select: "title description createdAt",
  },
  {
    path: "linkedDocument",
    select: "name type status reference documentData createdAt",
  },
  {
    path: "organization",
    select: "name logo",
  },
];
class ImsProjectWorkPackageDocumentRelationship extends ImsProjectWorkPackage {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectWorkPackageDocumentRelationship(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    let { parentWorkPackage, linkedDocument } = data;

    const exist = await this.ImsProjectWorkPackageDocumentRelationship.find({
      parentWorkPackage: parentWorkPackage,
      linkedDocument: linkedDocument,
    });
    if (exist.length > 0) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This document is already linked with the work package."
      );
    }

    let newImsProjectWorkPackageDocumentRelationship =
      new this.ImsProjectWorkPackageDocumentRelationship({
        parentWorkPackage,
        linkedDocument,
        organization: this.connection.user.organizationId,
      });

    newImsProjectWorkPackageDocumentRelationship =
      await newImsProjectWorkPackageDocumentRelationship.save();
    return newImsProjectWorkPackageDocumentRelationship.populate(population);
  }

  async listImsProjectWorkPackageDocumentRelationship(query, options) {
    const pagination =
      await this.ImsProjectWorkPackageDocumentRelationship.paginateByOrg(
        this.connection.user.organizationId,
        query,
        { ...options, populate: population }
      );
    return pagination;
  }

  async hardRemoveImsProjectWorkPackageDocumentRelationship(id) {
    const imsProjectWorkPackageDocumentRelationship =
      await this.ImsProjectWorkPackageDocumentRelationship.find({
        _id: id,
      });

    if (imsProjectWorkPackageDocumentRelationship.length === 0) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No such documents found."
      );
    }

    if (imsProjectWorkPackageDocumentRelationship) {
      await this.ImsProjectWorkPackageDocumentRelationship.deleteOne({
        _id: id,
      });
      return imsProjectWorkPackageDocumentRelationship;
    }
  }
}

module.exports = { ImsProjectWorkPackageDocumentRelationship };
