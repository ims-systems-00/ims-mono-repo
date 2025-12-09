const StaffAlertService = require("../services/staffAlertsService");
const { Filters } = require("../services/utility");

exports.createAlert = async (req, res) => {
  let staffAlertService = new StaffAlertService(req.accessControl);
  let validation = { isValid: true, messages: [] };
  if (!validation.isValid)
    return res.status(400).json({ message: "Invalid input" });
  let [createError, createdAlert] = await staffAlertService.createAlert({
    ...req.body,
    organization: req.accessControl.organisationId,
  });
  if (createError)
    return res
      .status(400)
      .json({ message: "Alert failed. Server error occured." });
  return res
    .status(200)
    .json({ message: "People alerted successfully.", alert: createdAlert });
};
exports.getAlerts = async (req, res) => {
  let staffAlertService = new StaffAlertService(req.accessControl);
  let { page, size, sort, userId } = req.query;
  let filter = new Filters(req, { searchFields: ["reference"] })
    .build()
    .query();
  const options = { page, limit: size, sort };
  let query = { "alerted.by": userId, ...filter };
  let [alertsError, queryResult] = await staffAlertService.getAlerts(
    query,
    options
  );
  if (alertsError)
    return res
      .status(400)
      .json({ message: "Alerts retrival failed. Internal server error." });
  return res
    .status(200)
    .json({
      message: "Alert retrived successfully.",
      alerts: queryResult.alerts,
      pagination: queryResult.pagination,
    });
};
exports.getAlert = async (req, res) => {
  let staffAlertService = new StaffAlertService(req.accessControl);
  let { id } = req.params;
  let [alertError, alert] = await staffAlertService.getAlert(id);
  if (alertError)
    return res
      .status(400)
      .json({ message: "Alert retrival failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Alert retrived successfully.", alert });
};
exports.updateAlert = async (req, res) => {
  let staffAlertService = new StaffAlertService(req.accessControl);
  let { id } = req.params;
  let [alertError, alert] = await staffAlertService.updateAlert(id, req.body);
  if (alertError)
    return res
      .status(400)
      .json({ message: "Alert update failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Alert updated successfully.", alert });
};
exports.deleteAlert = async (req, res) => {
  let staffAlertService = new StaffAlertService(req.accessControl);
  let { id } = req.params;
  let [alertError, alert] = await staffAlertService.deleteAlert(id);
  if (alertError)
    return res
      .status(400)
      .json({ message: "Alert delete failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Alert deleted successfully.", alert });
};
