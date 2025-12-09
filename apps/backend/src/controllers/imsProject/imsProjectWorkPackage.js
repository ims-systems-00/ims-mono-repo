const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.createImsProjectWorkPackage({
        ...req.body,
        imsProjectId: projectId,
        organization: req.accessControl?.user?.organizationId,
      });
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package created successfully.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const { id , projectId} = req.params;
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.getImsProjectWorkPackage({
        _id: id,
        imsProjectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project work package retrived.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.updateImsProjectWorkPackage(id, {
        ...req.body,
        projectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project work package info updated.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
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
      imsProjectId: new mongoose.Types.ObjectId(req.params.projectId),
    };
    const results =
      await imsProjectWorkPackageService.listImsProjectWorkPackage(
        query,
        options
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectWorkPackages: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.softRemoveImsProjectWorkPackage(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package moved to trash.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.restoreImsProjectWorkPackage(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package restored.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectWorkPackage = async (req, res, next) => {
  let imsProjectWorkPackageService = new imsProject.ImsProjectWorkPackage(
    req.accessControl
  );
  try {
    const imsProjectWorkPackage =
      await imsProjectWorkPackageService.hardRemoveImsProjectWorkPackage(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project work package removed.",
      imsProjectWorkPackage,
    });
  } catch (error) {
    next(error);
  }
};
