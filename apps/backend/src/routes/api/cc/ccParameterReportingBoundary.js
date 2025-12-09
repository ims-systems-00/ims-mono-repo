const router = require("express").Router();

const {
  getCcParameterReportingBoundaries,
  updateCcParameterReportingBoundary,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

// cc parameter reporting boundaries

router.get(
  "/parameters/:parameterId/reporting-boundaries",
  [],
  getCcParameterReportingBoundaries
);
router.put(
  "/parameters/:parameterId/reporting-boundaries/:id",
  [validateBody(validations.ccValidation.updateCcParameterReportingBoundary)],
  updateCcParameterReportingBoundary
);

module.exports = router;
