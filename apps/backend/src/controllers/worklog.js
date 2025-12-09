const WorklogService = require("../services/worklog");
const { Filters } = require("../services/utility");
const {
  authWalletAccess,
} = require("./expensereports/utils/reportAccessController");

exports.clockIn = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let [clockInError, worklog] = await worklogService.clockIn({
    ...req.body,
    created: {
      by: req.accessControl.user._id,
    },
  });
  if (clockInError)
    return res.status(500).json({
      message: clockInError.message
        ? clockInError.message
        : "Clocking in failed. Server error occurred.",
    });
  return res.status(200).json({ message: "Clocked in successfully.", worklog });
};
exports.pauseClock = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let [pauseClockError, worklog] = await worklogService.pauseClock({
    userId: req.accessControl.user._id,
  });
  if (pauseClockError) {
    if (pauseClockError.message === "No active sessions") {
      return res.status(200).json({
        message: pauseClockError.message,
        worklog: null,
      });
    }
    return res.status(500).json({
      message: pauseClockError.message
        ? pauseClockError.message
        : "Pausing clock failed. Server error occurred.",
    });
  }
  return res
    .status(200)
    .json({ message: "Paused clock successfully.", worklog });
};
exports.clockOut = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let [clockOutError, worklog] = await worklogService.clockOut({
    userId: req.accessControl.user._id,
    userTimeZone: req.accessControl.timeZone,
    ...req.body,
  });
  if (clockOutError) {
    return res.status(500).json({
      message: clockOutError.message
        ? clockOutError.message
        : "Clocking out failed. Server error occurred.",
    });
  }
  return res
    .status(200)
    .json({ message: "Clocked out successfully.", worklog });
};
exports.getWorklogs = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let { page, sort, size } = req.query;
  let filter = new Filters(req, { searchFields: [] }).build().query();
  const options = { page, limit: size, sort };
  if (!authWalletAccess(req.accessControl, { userId: req.query?.created?.by }))
    return res.status(400).json({
      message: "Worklogs retrieval failed. Access denied.",
    });
  let query = { "created.by": req.query?.created?.by, ...filter };
  let [getWorklogsError, queryResult] = await worklogService.getWorklogs(
    query,
    options
  );
  if (getWorklogsError)
    return res.status(500).json({ message: "Worklogs retrieval failed." });
  return res.status(200).json({
    message: "Worklogs retrieved successfully.",
    pagination: queryResult.pagination,
    worklogs: queryResult.worklogs,
  });
};
exports.getWorklog = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let { id } = req.params;
  let [getWorklogError, worklog] = await worklogService.getWorklog(id);
  if (getWorklogError) {
    return res.status(500).json({
      message: getWorklogError.message
        ? getWorklogError.message
        : "Worklog retrieval failed. Internal server error occurred",
    });
  }
  if (
    !authWalletAccess(req.accessControl, {
      userId: worklog?.created?.by?._id,
    })
  )
    return res.status(400).json({
      message: "Worklog retrieval failed. Access denied.",
    });
  return res
    .status(200)
    .json({ message: "Worklog retrieved successfully", worklog });
};
exports.getActiveWorklog = async (req, res) => {
  let worklogService = new WorklogService(req.accessControl);
  let [getSessionError, worklog] = await worklogService.getActiveWorklog({
    userId: req.accessControl.user._id,
  });
  if (getSessionError) {
    return res.status(500).json({
      message: getSessionError.message
        ? getSessionError.message
        : "Session retrieval failed. Internal server error occurred",
    });
  }
  if (!worklog) {
    return res.status(200).json({
      message: "No active session exists for the current user",
      worklog: null,
    });
  }
  return res.status(200).json({
    message: "Session retrieved successfully",
    worklog,
  });
};
