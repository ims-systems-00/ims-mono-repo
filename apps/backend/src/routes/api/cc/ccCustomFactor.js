const router = require("express").Router();

const {
  createCcCustomFactor,
  listCcCustomFactor,
  getCcCustomFactor,
  updateCcCustomFactor,
  restoreCcCustomFactor,
  softRemoveCcCustomFactor,
  hardRemoveCcCustomFactor,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
router.post(
  "/custom-factors",
  [validateBody(validations.ccValidation.createCcCustomFactorValidation)],
  createCcCustomFactor
);
router.get("/custom-factors/:id", [], getCcCustomFactor);
router.get("/custom-factors/", [], listCcCustomFactor);
router.put(
  "/custom-factors/:id",
  [validateBody(validations.ccValidation.updateCcCustomFactorValidation)],
  updateCcCustomFactor
);
router.put("/custom-factors/:id/restore", [], restoreCcCustomFactor);
router.delete("/custom-factors/:id/soft", [], softRemoveCcCustomFactor);
router.delete("/custom-factors/:id/hard", [], hardRemoveCcCustomFactor);

module.exports = router;
