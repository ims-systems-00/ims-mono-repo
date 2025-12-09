const router = require("express").Router();
const {
  acceptPartnershipProgram,
  softRemovePartnershipProgram,
  hardRemovePartnership,
  restorePartnershipProgram,
  adminListPartnership,
} = require("../../../controllers/partnershipProgram");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/partnershipProgram");
const validateBody = validate("body");
const checkImsAdmin = require("../../../middleware/checkImsAdmin");
router.post("/:id/acceptance", [checkImsAdmin], acceptPartnershipProgram);

router.get("/", [checkImsAdmin], adminListPartnership);

router.delete("/:id/soft", [checkImsAdmin], softRemovePartnershipProgram);
router.delete("/:id/hard", [checkImsAdmin], hardRemovePartnership);
router.put("/:id/restore", [checkImsAdmin], restorePartnershipProgram);

module.exports = router;
