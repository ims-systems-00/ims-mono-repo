const router = require("express").Router();

const {
  createImsProjectMemberShip,
  getImsProjectMemberShip,
  listImsProjectMemberShip,
  updateImsProjectMemberShip,
  restoreImsProjectMemberShip,
  softRemoveImsProjectMemberShip,
  hardRemoveImsProjectMemberShip,
} = require("../../../controllers/imsProject");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
// ims project memberships

router.post(
  "/:projectId/memberships/",
  [validateBody(validations.imsProjects.createiMSProjectMembership)],
  createImsProjectMemberShip
);
router.get("/:projectId/memberships/:id", [], getImsProjectMemberShip);
router.get("/:projectId/memberships/", [], listImsProjectMemberShip);
router.put(
  "/:projectId/memberships/:id",
  [validateBody(validations.imsProjects.updateiMSProjectMembership)],
  updateImsProjectMemberShip
);
router.put(
  "/:projectId/memberships/:id/restore",
  [],
  restoreImsProjectMemberShip
);
router.delete(
  "/:projectId/memberships/:id/soft",
  [],
  softRemoveImsProjectMemberShip
);
router.delete(
  "/:projectId/memberships/:id/hard",
  [],
  hardRemoveImsProjectMemberShip
);

module.exports = router;
