const router = require("express").Router();
const {
  getPartnershipProgram,
  updatePartnershipInformation,
  analyticsByPartnership,
  hardRemovePartnership,
  restorePartnershipProgram,
  listPartnership,
  createPartnershipProgram,
} = require("../../../controllers/partnershipProgram");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/partnershipProgram");
const validateBody = validate("body");
router.post(
  "/",
  [validateBody(validations.createPartnershipData)],
  createPartnershipProgram
);

router.get("/:id", [], getPartnershipProgram);
router.get("/:id/analytics", [], analyticsByPartnership);
router.get("/", [], listPartnership);

router.put(
  "/:id",
  [validateBody(validations.updatePartnershipData)],
  updatePartnershipInformation
);

module.exports = router;
