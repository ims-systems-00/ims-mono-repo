const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectWorkPackageDocumentRelationship = async (
  req,
  res,
  next
) => {
  let imsProjectWorkPackageDocumentRelationshipService =
    new imsProject.ImsProjectWorkPackageDocumentRelationship(req.accessControl);
  try {
    const { id } = req.params;
    const imsProjectWorkPackageDocumentRelationship =
      await imsProjectWorkPackageDocumentRelationshipService.createImsProjectWorkPackageDocumentRelationship(
        {
          ...req.body,
          parentWorkPackage: id,
          organization: req.accessControl?.user?.organizationId,
        }
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package link document created successfully.",
      imsProjectWorkPackageDocumentRelationship,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectWorkPackageDocumentRelationship = async (
  req,
  res,
  next
) => {
  let imsProjectWorkPackageDocumentRelationshipService =
    new imsProject.ImsProjectWorkPackageDocumentRelationship(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = {
      ...filter,
      parentWorkPackage: new mongoose.Types.ObjectId(req.params.id),
    };
    const results =
      await imsProjectWorkPackageDocumentRelationshipService.listImsProjectWorkPackageDocumentRelationship(
        query,
        options
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package linked documents retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectWorkPackageDocumentRelationships:
        formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectWorkPackageDocumentRelationship = async (
  req,
  res,
  next
) => {
  let imsProjectWorkPackageDocumentRelationshipService =
    new imsProject.ImsProjectWorkPackageDocumentRelationship(req.accessControl);
  try {
    const imsProjectWorkPackageDocumentRelationship =
      await imsProjectWorkPackageDocumentRelationshipService.hardRemoveImsProjectWorkPackageDocumentRelationship(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package linked document removed.",
      imsProjectWorkPackageDocumentRelationship,
    });
  } catch (error) {
    next(error);
  }
};
