const ExpensesService = require("../../services/expenses");

exports.includeAccommodationInReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [includeError, report] =
    await expenseService.includeAccommodationToReport(id, req.body);
  if (includeError)
    return res.status(500).json({
      message: "Accommodation include failed. Internal server error.",
    });
  return res
    .status(200)
    .json({ message: "Accommodation included successfully.", report });
};
exports.updateAccommodation = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, accommodationId } = req.params;
  let [updateError, report] = await expenseService.updateAccommodation(
    id,
    accommodationId,
    req.body
  );
  if (updateError)
    return res
      .status(500)
      .json({ message: "Trip update failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Trip updated successfully.", report });
};
exports.removeAccommodationFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, accommodationId } = req.params;
  let [expenseError, report] =
    await expenseService.removeAccommodationFromReport(id, accommodationId);
  if (expenseError)
    return res.status(500).json({
      message: "Accommodation removal failed. Internal server error.",
    });
  return res
    .status(200)
    .json({ message: "Accommodation removed successfully.", report });
};
exports.removeAttachmentFromAccommodationFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, attachmentId } = req.params;
  let [expenseError, report] =
    await expenseService.removeAttachmentFromAccommodationFromReport(
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
