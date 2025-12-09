const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectWorkPackageRelationship = async (req, res, next) => {
  let imsProjectWorkPackageRelationshipService =
    new imsProject.ImsProjectWorkPackageRelationship(req.accessControl);
  try {
    const { id } = req.params;
    let payload = {
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    };
    if (req.body.childWorkPackage) {
      payload.parentWorkPackage = id;
    } else if (req.body.waitingWorkPackage) {
      payload.blockingWorkPackage = id;
    }
    const imsProjectWorkPackageRelationship =
      await imsProjectWorkPackageRelationshipService.createImsProjectWorkPackageRelationship(
        payload
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package relationship created successfully.",
      imsProjectWorkPackageRelationship,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectWorkPackageRelationship = async (req, res, next) => {
  let imsProjectWorkPackageRelationshipService =
    new imsProject.ImsProjectWorkPackageRelationship(req.accessControl);
  try {
    const { id } = req.params;
    const imsProjectWorkPackageRelationship =
      await imsProjectWorkPackageRelationshipService.getImsProjectWorkPackageRelationship(
        {
          _id: id,
        }
      );
    res.status(StatusCodes.OK).json({
      message: "iMS Project work package relationship retrived.",
      imsProjectWorkPackageRelationship,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectWorkPackageRelationship = async (req, res, next) => {
  let imsProjectWorkPackageRelationshipService =
    new imsProject.ImsProjectWorkPackageRelationship(req.accessControl);
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
    };
    const results =
      await imsProjectWorkPackageRelationshipService.listImsProjectWorkPackageRelationship(
        query,
        options
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package relationships retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectWorkPackageRelationships: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectWorkPackageRelationship = async (
  req,
  res,
  next
) => {
  let imsProjectWorkPackageRelationshipService =
    new imsProject.ImsProjectWorkPackageRelationship(req.accessControl);
  try {
    const imsProjectWorkPackageRelationship =
      await imsProjectWorkPackageRelationshipService.hardRemoveImsProjectWorkPackageRelationship(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package relationship removed.",
      imsProjectWorkPackageRelationship,
    });
  } catch (error) {
    next(error);
  }
};
