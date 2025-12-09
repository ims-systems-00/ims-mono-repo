const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectWorkPackageAssignment = async (req, res, next) => {
  let imsProjectWorkPackageAssignmentService =
    new imsProject.ImsProjectWorkPackageAssignment(req.accessControl);
  try {
    const { projectId, id } = req.params;
    const imsProjectWorkPackageAssignment =
      await imsProjectWorkPackageAssignmentService.createImsProjectWorkPackageAssignment(
        {
          ...req.body,
          imsProjectWorkPackage: id,
          imsProjectId: projectId,
          organization: req.accessControl?.user?.organizationId,
        }
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package assignment created successfully.",
      imsProjectWorkPackageAssignment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectWorkPackageAssignment = async (req, res, next) => {
  let imsProjectWorkPackageAssignmentService =
    new imsProject.ImsProjectWorkPackageAssignment(req.accessControl);
  try {
    const { id } = req.params;
    const imsProjectWorkPackageAssignment =
      await imsProjectWorkPackageAssignmentService.getImsProjectWorkPackageAssignment(
        {
          _id: id,
        }
      );
    res.status(StatusCodes.OK).json({
      message: "iMS Project work package assignment retrived.",
      imsProjectWorkPackageAssignment,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectWorkPackageAssignment = async (req, res, next) => {
  let imsProjectWorkPackageAssignmentService =
    new imsProject.ImsProjectWorkPackageAssignment(req.accessControl);
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
      await imsProjectWorkPackageAssignmentService.listImsProjectWorkPackageAssignment(
        query,
        options
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package assignments retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectWorkPackageAssignments: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectWorkPackageAssignment = async (req, res, next) => {
  let imsProjectWorkPackageAssignmentService =
    new imsProject.ImsProjectWorkPackageAssignment(req.accessControl);
  try {
    const imsProjectWorkPackageAssignment =
      await imsProjectWorkPackageAssignmentService.hardRemoveImsProjectWorkPackageAssignment(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package assignment removed.",
      imsProjectWorkPackageAssignment,
    });
  } catch (error) {
    next(error);
  }
};
