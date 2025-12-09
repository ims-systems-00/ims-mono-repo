const router = require("express").Router();

const { getCcParameterReportingYears, updateCcParameterReportingYear } = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

// cc parameter reporting years

router.get(
  "/parameters/:parameterId/reporting-years",
  [],
  getCcParameterReportingYears
);
router.put(
  "/parameters/:parameterId/reporting-years/:id",
  [validateBody(validations.ccValidation.updateCcParameterReportingYear)],
  updateCcParameterReportingYear
);
module.exports = router;
