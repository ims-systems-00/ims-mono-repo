const Holidays = require("date-holidays");
const LeaveService = require("../services/leaves");
const { Filters } = require("../services/utility");
const {
  authWalletAccess,
} = require("./expensereports/utils/reportAccessController");
const Trigger = require("../services/triggers");
const { mainChannel } = require("../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../eventsV2/topicsName");

exports.requestLeave = async (req, res) => {
  let leaveService = new LeaveService(req.accessControl);
  let [createError, leaveRequest] = await leaveService.createLeave({
    ...req.body,
    organization: req.accessControl.organisationId,
    created: {
      by: req.accessControl.user._id,
    },
  });
  if (createError)
    return res.status(500).json({
      message: createError.message
        ? createError.message
        : "Leave request create failed. Server error occured.",
    });
  return res
    .status(200)
    .json({ message: "Leave request created successfully.", leaveRequest });
};
exports.getLeaveRequests = async (req, res) => {
  let leaveService = new LeaveService(req.accessControl);
  let { page, sort, size } = req.query;
  let filter = new Filters(req, { searchFields: [] }).build().query();
  const options = { page, limit: size, sort };
  if (!authWalletAccess(req.accessControl, { userId: req.query?.created?.by }))
    return res.status(400).json({
      message: "Leave reports retrival failed. Access denied.",
    });
  let query = { "created.by": req.query?.created?.by, ...filter };
  let [leaveRequestsError, queryResult] = await leaveService.getLeaves(
    query,
    options
  );
  if (leaveRequestsError)
    return res.status(500).json({ message: "Leave request retrived failed." });
  return res.status(200).json({
    message: "Leave request retrived successfully.",
    pagination: queryResult.pagination,
    leaveRequests: queryResult.leaveRequests,
  });
};
exports.getLeaveRequest = async (req, res) => {
  let leaveService = new LeaveService(req.accessControl);
  let { id } = req.params;
  let [leaveRequestError, leaveRequest] = await leaveService.getLeave(id);
  if (leaveRequestError)
    return res.status(500).json({
      message: "Leave request retrival failed. Internal server error.",
    });
  if (
    !authWalletAccess(req.accessControl, {
      userId: leaveRequest?.created?.by?._id,
    })
  )
    return res.status(400).json({
      message: "Leave reports retrival failed. Access denied.",
    });
  return res
    .status(200)
    .json({ message: "Leave request retrived successfully.", leaveRequest });
};
exports.updateLeaveRequest = async (req, res) => {
  let leaveService = new LeaveService(req.accessControl);
  let { id } = req.params;
  let [leaveRequestError, leaveRequest] = await leaveService.updateLeave(id, {
    ...req.body,
    created: { by: req.accessControl.user._id },
  });
  if (leaveRequestError)
    return res
      .status(500)
      .json({ message: "Leave request update failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Leave request updated successfully.", leaveRequest });
};
exports.deleteLeaveRequest = async (req, res) => {
  let leaveService = new LeaveService(req.accessControl);
  let { id } = req.params;
  let [leaveRequestError, leaveRequest] = await leaveService.deleteLeave(id);
  if (leaveRequestError)
    return res
      .status(500)
      .json({ message: "Leave request delete failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Leave request deleted successfully.", leaveRequest });
};
exports.handleLeaveRequest = async (req, res) => {
  let trigger = new Trigger(req.accessControl);
  let leaveService = new LeaveService(req.accessControl);
  let { id } = req.params;
  let [leaveRequestError, leaveRequest] = await leaveService.handleRequest(id, {
    ...req.body,
    userId: req.accessControl.user._id,
  });
  if (leaveRequestError) {
    if (leaveRequestError.message === "No pending leave with that id found.") {
      return res.status(200).json({
        message: leaveRequestError.message,
      });
    }
    return res.status(500).json({
      message: leaveRequestError.message
        ? leaveRequestError.message
        : "Leave request processing failed. Internal server error.",
    });
  }
  // trigger.sendNotification("leaveRequestReviewedEvent", leaveRequest);
  mainChannel.topic(SERVER_EVENTS_BUS.LEAVE_REQUEST_REVIEWED_EVENT).emit({
    accessControl: req.accessControl,
    leaveRequest,
  });
  return res.status(200).json({
    message: `Leave request ${req.body.decision} successfully.`,
    leaveRequest,
  });
};
exports.handleLeaveSubmission = async (req, res) => {
  let trigger = new Trigger(req.accessControl);
  let leaveService = new LeaveService(req.accessControl);
  let { id } = req.params;
  let [leaveRequestError, leaveRequest] = await leaveService.handleSubmission(
    id,
    { status: "Pending" }
  );
  if (leaveRequestError)
    return res.status(500).json({
      message: "Leave request processing failed. Internal server error.",
    });
  // trigger.sendNotification("newLeaveRequestSubmissionEvent", leaveRequest);
  mainChannel.topic(SERVER_EVENTS_BUS.NEW_LEAVE_REQUEST_SUBMISSION_EVENT).emit({
    accessControl: req.accessControl,
    leaveRequest,
  });
  return res.status(200).json({
    message: `Leave request submitted successfully.`,
    leaveRequest,
  });
};

exports.getHolidaysForYear = async (req, res) => {
  const { countryCode, year } = req.query;
  if (!countryCode) {
    return res.status(400).json({
      message: `Holiday retrieval failed. No country code provided in query`,
    });
  }
  const holidays = new Holidays(countryCode);
  return res.status(200).json({
    message: `Holiday retrieval successful`,
    holidays: holidays.getHolidays(year),
  });
};
