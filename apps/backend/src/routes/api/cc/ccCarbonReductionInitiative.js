const router = require("express").Router();

const {
  createCcCarbonReductionInitiative,
  getCcCarbonReductionInitiative,
  listCcCarbonReductionInitiative,
  updateCcCarbonReductionInitiative,
  restoreCcCarbonReductionInitiative,
  softRemoveCcCarbonReductionInitiative,
  hardRemoveCcCarbonReductionInitiative,
  updateCcCarbonReductionInitiativeAttachments,
  updateCcCarbonReductionInitiativeAssignedUsers,
  deleteCcCarbonReductionInitiativeAttachment,
  deleteCcCarbonReductionInitiativeAssignedUser,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
router.post(
  "/initiatives",
  [validateBody(validations.ccValidation.createReductionPlanInitative)],
  createCcCarbonReductionInitiative
);
router.get("/initiatives/:id", [], getCcCarbonReductionInitiative);
router.get("/initiatives/", [], listCcCarbonReductionInitiative);
router.put(
  "/initiatives/:id",
  [validateBody(validations.ccValidation.updateReductionPlanInitative)],
  updateCcCarbonReductionInitiative
);
router.put("/initiatives/:id/restore", [], restoreCcCarbonReductionInitiative);
router.delete(
  "/initiatives/:id/soft",
  [],
  softRemoveCcCarbonReductionInitiative
);
router.delete(
  "/initiatives/:id/hard",
  [],
  hardRemoveCcCarbonReductionInitiative
);

router.post(
  "/initiatives/:id/attachments",
  [],
  updateCcCarbonReductionInitiativeAttachments
);
router.delete(
  "/initiatives/:initiativeId/attachments/:attachmentId/",
  [],
  deleteCcCarbonReductionInitiativeAttachment
);

router.post(
  "/initiatives/:id/users",
  [],
  updateCcCarbonReductionInitiativeAssignedUsers
);

router.delete(
  "/initiatives/:initiativeId/users/:userId/",
  [],
  deleteCcCarbonReductionInitiativeAssignedUser
);

module.exports = router;
