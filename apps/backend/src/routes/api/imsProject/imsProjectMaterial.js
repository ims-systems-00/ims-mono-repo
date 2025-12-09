const router = require("express").Router();

const {
  createImsProjectMaterial,
  getImsProjectMaterial,
  listImsProjectMaterial,
  updateImsProjectMaterial,
  restoreImsProjectMaterial,
  softRemoveImsProjectMaterial,
  hardRemoveImsProjectMaterial,
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
  "/:projectId/materials/",
  [validateBody(validations.imsProjects.createImsProjectMaterial)],
  createImsProjectMaterial
);
router.get("/:projectId/materials/:id", [], getImsProjectMaterial);
router.get("/:projectId/materials/", [], listImsProjectMaterial);
router.put(
  "/:projectId/materials/:id",
  [validateBody(validations.imsProjects.updateiMSProjectMaterial)],
  updateImsProjectMaterial
);
router.put("/:projectId/materials/:id/restore", [], restoreImsProjectMaterial);
router.delete(
  "/:projectId/materials/:id/soft",
  [],
  softRemoveImsProjectMaterial
);
router.delete(
  "/:projectId/materials/:id/hard",
  [],
  hardRemoveImsProjectMaterial
);

module.exports = router;
