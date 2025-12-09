const express = require("express");
const router = express.Router();
const { validate } = require("../../../middleware/validator");
const validateBody = validate("body");
const {
  updateExpense,
  updateTravel,
  updateAccommodation,
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  includeExpenseInReport,
  removeExpenseFromReport,
  removeAccommodationFromReport,
  removeTravelFromReport,
  submitReport,
  evaluateReport,
  includeAccommodationInReport,
  includeTravelInReport,
  removeAttachmentFromTravelFromReport,
  removeAttachmentFromAccommodationFromReport,
  removeAttachmentFromExpenseFromReport,
} = require("../../../controllers/expensereports");
const schemas = require("../../../validations/index");
const {
  injectAttachmentModifierMetaData,
} = require("../../../middleware/injectAttachmentModifier");

router.post(
  "/",
  [],
  validateBody(schemas.expensesValidation.report.create),
  createReport
);
router.get("/", [], getReports);
router.get("/:id", [], getReport);
router.put(
  "/:id",
  [],
  validateBody(schemas.expensesValidation.report.update),
  updateReport
);
router.delete("/:id", [], deleteReport);

router.patch("/:id/submission", submitReport);

router.patch(
  "/:id/evaluation",
  validateBody(schemas.expensesValidation.report.evaluate),
  evaluateReport
);

router.post(
  "/:id/expenses",
  [
    validateBody(schemas.expensesValidation.expense.create),
    injectAttachmentModifierMetaData("attachments"),
  ],
  includeExpenseInReport
);
router.put(
  "/:id/expenses/:expenseId",
  [
    validateBody(schemas.expensesValidation.expense.update),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateExpense
);
router.delete("/:id/expenses/:expenseId", [], removeExpenseFromReport);
router.delete(
  "/:id/expenses/:accommodationId/attachment/:attachmentId",
  [],
  removeAttachmentFromExpenseFromReport
);

router.post(
  "/:id/accommodations",
  [
    validateBody(schemas.expensesValidation.accommodation.create),
    injectAttachmentModifierMetaData("attachments"),
  ],
  includeAccommodationInReport
);
router.put(
  "/:id/accommodations/:accommodationId",
  [
    validateBody(schemas.expensesValidation.accommodation.update),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateAccommodation
);
router.delete(
  "/:id/accommodations/:accommodationId",
  [],
  removeAccommodationFromReport
);
router.delete(
  "/:id/accommodations/:accommodationId/attachment/:attachmentId",
  [],
  removeAttachmentFromAccommodationFromReport
);

router.post(
  "/:id/travels",
  [
    validateBody(schemas.expensesValidation.travel.create),
    injectAttachmentModifierMetaData("attachments"),
  ],
  includeTravelInReport
);
router.put(
  "/:id/travels/:travelId",
  [
    validateBody(schemas.expensesValidation.travel.update),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateTravel
);
router.delete("/:id/travels/:travelId", [], removeTravelFromReport);
router.delete(
  "/:id/travels/:accommodationId/attachment/:attachmentId",
  [],
  removeAttachmentFromTravelFromReport
);

module.exports = router;
