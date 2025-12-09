const ExpensesService = require("../../services/expenses");

exports.includeExpenseInReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id } = req.params;
  let [includError, report] = await expenseService.includeExpenseToReport(
    id,
    req.body
  );
  if (includError)
    return res
      .status(500)
      .json({ message: "Expense include failed. Internal server error." });
  else if (report === null) {
    return res.status(404).json({
      message: "Expense include failed. No such expense report exists",
    });
  }
  return res
    .status(200)
    .json({ message: "Expense included successfully.", report });
};
exports.updateExpense = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  const { id, expenseId } = req.params;
  let [expenseError, report] = await expenseService.updateExpense(
    id,
    expenseId,
    req.body
  );
  if (expenseError)
    return res
      .status(500)
      .json({ message: "Expense update failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Expense updated successfully.", report });
};
exports.removeExpenseFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, expenseId } = req.params;
  let [removeError, report] = await expenseService.removeExpenseFromReport(
    id,
    expenseId
  );
  if (removeError)
    return res
      .status(500)
      .json({ message: "Expense removal failed. Internal server error." });
  return res
    .status(200)
    .json({ message: "Expense removed successfully.", report });
};
exports.removeAttachmentFromExpenseFromReport = async (req, res) => {
  let expenseService = new ExpensesService(req.accessControl);
  let { id, attachmentId } = req.params;
  let [expenseError, report] =
    await expenseService.removeAttachmentFromExpenseFromReport(
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
