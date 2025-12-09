const router = require("express").Router();

const {
  createImsProjectBudget,
  getImsProjectBudget,
  listImsProjectBudget,
  updateImsProjectBudget,
  restoreImsProjectBudget,
  softRemoveImsProjectBudget,
  hardRemoveImsProjectBudget,
} = require("../../../controllers/imsProject");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
// ims project budget

router.post(
  "/:projectId/budgets/",
  [validateBody(validations.imsProjects.createiMSProjectBudget)],
  createImsProjectBudget
);
router.get("/:projectId/budgets/:id", [], getImsProjectBudget);
router.get("/:projectId/budgets/", [], listImsProjectBudget);
router.put(
  "/:projectId/budgets/:id",
  [validateBody(validations.imsProjects.updateiMSProjectBudget)],
  updateImsProjectBudget
);
router.put("/:projectId/budgets/:id/restore", [], restoreImsProjectBudget);
router.delete("/:projectId/budgets/:id/soft", [], softRemoveImsProjectBudget);
router.delete("/:projectId/budgets/:id/hard", [], hardRemoveImsProjectBudget);

module.exports = router;
