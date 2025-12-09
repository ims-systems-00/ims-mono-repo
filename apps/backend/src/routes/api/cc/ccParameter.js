const router = require("express").Router();

const {
  createCcParameter,
  getCcParameter,
  listCcParameters,
  updateCcParameter,
  restoreCcParameter,
  softRemoveCcParameter,
  hardRemoveCcParameter,
  getCcParameterReportingBoundaries,
  updateCcParameterReportingBoundaries,
  getCcParameterReportingYears,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

// cc parameters

router.post(
  "/parameters",
  [validateBody(validations.ccValidation.createCcParameter)],
  createCcParameter
);
router.get("/parameters/:id", [], getCcParameter);
router.get("/parameters/", [], listCcParameters);
router.put(
  "/parameters/:id",
  [validateBody(validations.ccValidation.updateCcParameter)],
  updateCcParameter
);
router.put("/parameters/:id/restore", [], restoreCcParameter);
router.delete("/parameters/:id/soft", [], softRemoveCcParameter);
router.delete("/parameters/:id/hard", [], hardRemoveCcParameter);

module.exports = router;
