const router = require("express").Router();
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");

const {
  globalStats,
  digitalMaturityStats,
  complianceStats,
  auditStats,
  riskStats,
  incidentStats,
  inventoryStats,
  supplierStats,
  cipStats,
  crmStats,
} = require("../../../controllers/stats");

router.get("/global", [], globalStats);
router.get("/digital-maturity", [], digitalMaturityStats);
router.get("/compliance", [], complianceStats);
router.get("/audit", [], auditStats);
router.get("/risk", [], riskStats);
router.get("/incident", [], incidentStats);
router.get("/inventory", [], inventoryStats);
router.get("/supplier", [], supplierStats);
router.get("/cip", [], cipStats);
router.get("/crm", [], crmStats);

module.exports = router;
