const router = require("express").Router();

const {
  getCcReport,
  getCcSingleYearReport,
  getBaseYearCompareReport,
  getScopeOneAndTwoReport,
  getHistoricTrendsReport,
  getActivitySummaryReport,
  getGHGStatementReport,
  getFullReport,
  listCcReports,
  getSecrReport,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

/**
 * order in the get request matters here
 * /reports/:id always has to be at the end of other paths
 */
router.get("/reports/", [], listCcReports);
router.get("/reports/single-year-report", [], getCcSingleYearReport);
router.get("/reports/base-year-compare-report", [], getBaseYearCompareReport);
router.get("/reports/scope-one-and-two-report", [], getScopeOneAndTwoReport);
router.get("/reports/historic-trends-report", [], getHistoricTrendsReport);
router.get("/reports/activity-summary-report", [], getActivitySummaryReport);
router.get("/reports/ghg-statement-report", [], getGHGStatementReport);
router.get("/reports/full-report", [], getFullReport);
router.get("/reports/secr-report", [], getSecrReport);
router.get("/reports/:id", [], getCcReport);

module.exports = router;
