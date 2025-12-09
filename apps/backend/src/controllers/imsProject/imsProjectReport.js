const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectReport =
      await imsProjectReportService.createImsProjectReport({
        ...req.body,
        organization: req.accessControl?.user?.organizationId,
        createdBy: req.accessControl?.user?._id,
        imsProjectId: projectId,
      });
    return res.status(StatusCodes.OK).json({
      message: "iMS Project Report created successfully.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const { id, projectId } = req.params;
    const imsProjectReport =
      await imsProjectReportService.getImsProjectReport({
        _id: id,
        imsProjectId: projectId
      });
    res.status(StatusCodes.OK).json({
      message: "imsProject Report retrived.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectReport =
      await imsProjectReportService.updateImsProjectReport(id, {
        ...req.body,
        projectId: projectId
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project Report info updated.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
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
    let query = { ...filter };
    const results = await imsProjectReportService.listImsProjectReport(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "ims Project Report retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectReports: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const imsProjectReport =
      await imsProjectReportService.softRemoveImsProjectReport(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project Report moved to trash.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const imsProjectReport =
      await imsProjectReportService.restoreImsProjectReport(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Project Report restored.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectReport = async (req, res, next) => {
  let imsProjectReportService = new imsProject.ImsProjectReport(
    req.accessControl
  );
  try {
    const imsProjectReport =
      await imsProjectReportService.hardRemoveImsProjectReport(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project Report removed.",
      imsProjectReport,
    });
  } catch (error) {
    next(error);
  }
};
