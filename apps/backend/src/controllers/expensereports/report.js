const ExpensesService = require("../../services/expenses");
const { Filters } = require("../../services/utility");
const { authWalletAccess } = require("./utils/reportAccessController");
const Trigger = require("../../services/triggers");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
exports.createReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  const { body } = req;
  let [createError, createdReport] = await expenseService.createReport({
    ...body,
    organization: req.accessControl.organisationId,
    created: {
      by: req.accessControl.user._id,
    },
  });
  if (createError)
    return res
      .status(500)
      .json({ message: "Expense report create failed. Server error occured." });
  return res.status(200).json({
    message: "Expense report created successfully.",
    report: createdReport,
  });
};

exports.getReports = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { page, size, sort } = req.query;
  if (!authWalletAccess(req.accessControl, { userId: req.query?.created?.by }))
    return res.status(400).json({
      message: "Expense reports retrival failed. Access denied.",
    });
  let filter = new Filters(req, { searchFields: ["reference"] })
    .build()
    .query();
  const options = { page, limit: size, sort };
  let query = { "created.by": req.query?.created?.by, ...filter };
  let [reportsError, queryResult] = await expenseService.getReports(
    query,
    options
  );
  if (reportsError)
    return res.status(500).json({
      message: "Expense reports retrival failed. Internal server error.",
    });
  return res.status(200).json({
    message: "Expense reports retrived successfully.",
    reports: queryResult.reports,
    pagination: queryResult.pagination,
  });
};

exports.getReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [reportError, report] = await expenseService.getReport(id);
  if (reportError)
    return res.status(500).json({
      message: "Expense report retrival failed. Internal server error.",
    });
  if (
    !authWalletAccess(req.accessControl, { userId: report?.created?.by?._id })
  )
    return res.status(400).json({
      message: "Expense reports retrival failed. Access denied.",
    });
  return res
    .status(200)
    .json({ message: "Expense report retrived successfully.", report });
};

exports.updateReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [updateError, report] = await expenseService.updateReport(id, req.body);
  if (updateError)
    return res.status(500).json({
      message: "Expense report update failed. Internal server error.",
    });
  return res
    .status(200)
    .json({ message: "Expense report updated successfully.", report });
};

exports.deleteReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [expenseError, report] = await expenseService.removeReport(id);
  if (expenseError)
    return res.status(500).json({
      message: "Expense report delete failed. Internal server error.",
    });
  return res
    .status(200)
    .json({ message: "Expense report deleted successfully.", report });
};

exports.submitReport = async (req, res) => {
  let trigger = new Trigger(req.accessControl);
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [reportError, report] = await expenseService.submitReport(id, {
    decision: "Pending",
  });
  if (reportError)
    return res
      .status(500)
      .json({ message: "Report submission failed.", report });
  // trigger.sendNotification("newExpenseReportSubmissionEvent", report);
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_EXPENSE_REPORT_SUBMISSION_EVENT)
    .emit({
      accessControl: req.accessControl,
      report,
    });
  return res
    .status(200)
    .json({ message: "Report submitted successfully.", report });
};

exports.evaluateReport = async (req, res) => {
  let trigger = new Trigger(req.accessControl);
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  const { decision } = req.body;
  const decisionMaker = req.accessControl.user._id;
  let [reportError, report] = await expenseService.evaluateReport(id, {
    decision,
    decisionMaker,
  });
  if (reportError) {
    if (
      reportError.message === "No pending expense report with that id found."
    ) {
      return res.status(200).json({
        message: reportError.message,
      });
    }
    return res
      .status(500)
      .json({ message: "Report evaluation failed.", report });
  }
  // trigger.sendNotification("expenseReportReviewedEvent", report);
  mainChannel.topic(SERVER_EVENTS_BUS.EXPENSE_REPORT_REVIEWED_EVENT).emit({
    accessControl: req.accessControl,
    report,
  });
  return res
    .status(200)
    .json({ message: "Report evaluated successfully.", report });
};
