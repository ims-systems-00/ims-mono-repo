const router = require("express").Router();
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

const {
  createImsForm,
  getImsForm,
  listImsForm,
  updateImsForm,
  softRemoveImsForm,
  restoreImsForm,
  hardRemoveImsForm,
  createImsFormElement,
  getImsFormElement,
  listImsFormElement,
  updateImsFormElement,
  restoreImsFormElement,
  softRemoveImsFormElement,
  hardRemoveImsFormElement,
  createImsFormResponse,
  getImsFormResponse,
  listImsFormResponse,
  updateImsFormResponse,
  restoreImsFormResponse,
  softRemoveImsFormResponse,
  hardRemoveimsFormResponse,
  createImsFormSubmission,
  getImsFormSubmission,
  updateImsFormSubmission,
  listImsFormSubmission,
  softRemoveImsFormSubmission,
  restoreImsFormSubmission,
  hardRemoveImsFormSubmission,
  changeImsFormElementOrder,
} = require("../../../controllers/imsForm");

router.post(
  "/",
  [validateBody(validations.imsForms.createImsFormValidation)],
  createImsForm
);
router.get("/:id", [], getImsForm);
router.get("/", [], listImsForm);
router.put(
  "/:id",
  [validateBody(validations.imsForms.updateImsFormValidation)],
  updateImsForm
);
router.put("/:id/restore", [], restoreImsForm);
router.delete("/:id/soft", [], softRemoveImsForm);
router.delete("/:id/hard", [], hardRemoveImsForm);

// ims form elements

router.post(
  "/:formId/elements/",
  [validateBody(validations.imsForms.createImsFormElementValidation)],
  createImsFormElement
);
router.get("/:formId/elements/:elementId", [], getImsFormElement);
router.get("/:formId/elements/", [], listImsFormElement);
router.put(
  "/:formId/elements/:elementId",
  [validateBody(validations.imsForms.updateImsFormElementValidation)],
  updateImsFormElement
);
router.put(
  "/:formId/elements/:elementId/order",
  [validateBody(validations.imsForms.changeImsFormElementOrderValidation)],
  changeImsFormElementOrder
);
router.put("/:formId/elements/:elementId/restore", [], restoreImsFormElement);
router.delete(
  "/:formId/elements/:elementId/soft",
  [],
  softRemoveImsFormElement
);
router.delete(
  "/:formId/elements/:elementId/hard",
  [],
  hardRemoveImsFormElement
);

// ims form response
router.post(
  "/:formId/responses/",
  [validateBody(validations.imsForms.createImsFormResponseValidation)],
  createImsFormResponse
);
router.get("/:formId/responses/:responseId", [], getImsFormResponse);
router.get("/:formId/responses/", [], listImsFormResponse);
router.put(
  "/:formId/responses/:responseId",
  [validateBody(validations.imsForms.updteImsFormResponseValidation)],
  updateImsFormResponse
);
router.put(
  "/:formId/responses/:responseId/restore",
  [],
  restoreImsFormResponse
);
router.delete(
  "/:formId/responses/:responseId/soft",
  [],
  softRemoveImsFormResponse
);
router.delete(
  "/:formId/responses/:responseId/hard",
  [],
  hardRemoveimsFormResponse
);

// ims form submission
router.post("/:formId/submissions/", [], createImsFormSubmission);
router.get("/:formId/submissions/:submissionId", [], getImsFormSubmission);
router.put("/:formId/submissions/:submissionId", [], updateImsFormSubmission);
router.get("/:formId/submissions/", [], listImsFormSubmission);
router.delete(
  "/:formId/submissions/:submissionId/soft",
  [],
  softRemoveImsFormSubmission
);
router.put(
  "/:formId/submissions/:submissionId/restore",
  [],
  restoreImsFormSubmission
);
router.delete(
  "/:formId/submissions/:submissionId/hard",
  [],
  hardRemoveImsFormSubmission
);

module.exports = router;
