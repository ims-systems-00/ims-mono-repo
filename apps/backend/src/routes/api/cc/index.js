const express = require("express");
const router = express.Router();
router.use("/", require("./ccCalculation"));
router.use("/", require("./ccLocation"));
router.use("/", require("./ccParameter"));
router.use("/", require("./ccParameterReportingBoundary")),
  router.use("/", require("./ccParameterReportingYear")),
  router.use("/", require("./ccCustomFactor"));
router.use("/", require("./ccReports")),
  router.use("/", require("./ccCarbonReductionInitiative"));
router.use("/", require("./ccDefraFactor"));

module.exports = router;
