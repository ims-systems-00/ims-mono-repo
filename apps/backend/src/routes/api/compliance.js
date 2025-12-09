const express = require("express");
const router = express.Router();

const {
  getComplianceTool,
  addEvidence,
  createComplianceTool,
  deleteComplianceTool,
  removeEvidence,
  grantLicense,
  updateControl,
  getControl,
  getOverview,
  updateComplianceTool,
  addControlEvidence,
  getControlEvidence,
  removeControlEvidence,
  updateControlStatus
} = require("../../controllers/compliance");
const validations = require("../../validations/controlStatus");
const { validate } = require("../../middleware/validator");
const validateBody = validate("body");

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  injectAttachmentModifierMetaData,
} = require("../../middleware/injectAttachmentModifier");

router.post("/", [], createComplianceTool, grantLicense);
router.put("/", [], updateComplianceTool);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.COMPLIANCE_TOOL,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getComplianceTool
);

router.delete("/", [], deleteComplianceTool);

router.get("/overview/:name", [], getOverview);

// control evidence routes ...
router.get("/controls/:id/control-evidence", [], getControlEvidence);

router.post(
  "/controls/:id/control-evidence", [
  enforceRbac({
    service: IMS_SERVICES.COMPLIANCE_TOOL,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  }),
  injectAttachmentModifierMetaData("fileStorage"),
], addControlEvidence
);

router.delete("/controls/:id/control-evidence/:evidence_id", [], removeControlEvidence);

router.post(
  "/controls/:id/evidence/",
  [
    enforceRbac({
      service: IMS_SERVICES.COMPLIANCE_TOOL,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("evidences"),
  ],
  addEvidence
);

router.delete("/controls/:id/evidence/:evidence_id", [], removeEvidence);

router.get("/controls/:id", [], getControl);

router.put("/controls/:id/status", [], updateControlStatus);
router.put("/controls/:id", [
  validateBody(validations.updateControlValidation),
], updateControl);

module.exports = router;
