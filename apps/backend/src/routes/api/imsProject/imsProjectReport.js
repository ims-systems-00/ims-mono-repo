const router = require("express").Router();

const {
  createImsProjectReport,
  getImsProjectReport,
  listImsProjectReport,
  updateImsProjectReport,
  restoreImsProjectReport,
  softRemoveImsProjectReport,
  hardRemoveImsProjectReport,
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
  "/:projectId/reports/",
  [],
  createImsProjectReport
);
router.get("/:projectId/reports/:id", [], getImsProjectReport);
router.get("/:projectId/reports/", [], listImsProjectReport);
router.put(
  "/:projectId/reports/:id",
  [],
  updateImsProjectReport
);
router.put("/:projectId/reports/:id/restore", [], restoreImsProjectReport);
router.delete("/:projectId/reports/:id/soft", [], softRemoveImsProjectReport);
router.delete("/:projectId/reports/:id/hard", [], hardRemoveImsProjectReport);

module.exports = router;
