const router = require("express").Router();
const {
  getMembership,
  listMembership,
  softRemoveMembership,
  hardRemoveMembership,
  restoreMembership,
  updateMembershipInformation,
  createMembership,
  updateMembershipRole,
} = require("../../../controllers/membership/");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/membership");
const validateBody = validate("body");
router.post(
  "/",
  [validateBody(validations.createMembershipData)],
  createMembership
);

router.get("/:id", [], getMembership);
router.get("/", [], listMembership);

router.put(
  "/:id",
  [validateBody(validations.updateMembershipData)],
  updateMembershipInformation
);
router.put(
  "/:id/role",
  [validateBody(validations.updateMembershipRole)],
  updateMembershipRole
);

router.delete("/:id/soft", [], softRemoveMembership);
router.delete("/:id/hard", [], hardRemoveMembership);

router.put("/:id/restore", [], restoreMembership);

module.exports = router;
