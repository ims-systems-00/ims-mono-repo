const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");
const cron = require("node-cron");

exports.sendReportEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const imsProjectEmailSchedule =
      await cron.schedule("0 0 * * *", imsProjectEmailScheduleService.sendScheduledEmails)
    return res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.createImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.createImsProjectEmailSchedule({
        ...req.body,
        imsProjectId: projectId,
        organization: req.accessControl?.user?.organizationId,
      });
    return res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule created successfully.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const { id, projectId } = req.params;
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.getImsProjectEmailSchedule({
        _id: id,
        imsProjectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "imsProject email schedule retrived.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.updateImsProjectEmailSchedule(id, {
        ...req.body,
        projectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule info updated.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
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
      await imsProjectEmailScheduleService.listImsProjectEmailSchedule(
        query,
        options
      );
    return res.status(StatusCodes.OK).json({
      message: "ims Project email schedule retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectEmailSchedules: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.softRemoveImsProjectEmailSchedule(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule moved to trash.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.restoreImsProjectEmailSchedule(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule restored.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectEmailSchedule = async (req, res, next) => {
  let imsProjectEmailScheduleService = new imsProject.ImsProjectEmailSchedule(
    req.accessControl
  );
  try {
    const imsProjectEmailSchedule =
      await imsProjectEmailScheduleService.hardRemoveImsProjectEmailSchedule(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project email schedule removed.",
      imsProjectEmailSchedule,
    });
  } catch (error) {
    next(error);
  }
};
