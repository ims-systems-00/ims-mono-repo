const ExpensesService = require("../../services/expenses");

exports.includeTravelInReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [includeError, report] = await expenseService.includeTravelToReport(
    id,
    req.body
  );
  if (includeError)
    return res
      .status(500)
      .json({ message: "Travel include failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Travel included successfully.", report });
};
exports.updateTravel = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  const { id, travelId } = req.params;
  let [expenseError, report] = await expenseService.updateTravel(
    id,
    travelId,
    req.body
  );
  if (expenseError)
    return res
      .status(500)
      .json({ message: "Travel update failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Travel updated successfully.", report });
};
exports.removeTravelFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, travelId } = req.params;
  let [expenseError, report] = await expenseService.removeTravelFromReport(
    id,
    travelId
  );
  if (expenseError)
    return res
      .status(500)
      .json({ message: "Travel removal failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Travel removed successfully.", report });
};
exports.removeAttachmentFromTravelFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, attachmentId } = req.params;
  let [expenseError, report] =
    await expenseService.removeAttachmentFromTravelFromReport(
      id,
      attachmentId
    );
  if (expenseError)
    return res.status(500).json({
      message: "Attachment removal failed. Internal server error.",
    });
  return res
    .status(200)
    .json({ message: "Attachment removed successfully.", report });
};
