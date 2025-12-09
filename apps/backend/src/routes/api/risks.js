const express = require("express");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const router = express.Router();
const schemas = require("../../validations/index");
const {
  createRisk,
  getRisks,
  getRisk,
  editRisk,
  acceptRisk,
  mitigateRisk,
  deleteRisk,
  escalateRisk,
  getRisksReport,
  seedData,
  deleteAttachment,
  linkISOControls,
  removeISOControls,
} = require("../../controllers/risk");

// auth middlewares ....

const { enforceRbac } = require("../../middleware/enforceRbac");
const { validate } = require("../../middleware/validator");
const {
  injectAttachmentModifierMetaData,
} = require("../../middleware/injectAttachmentModifier");
const validateBody = validate("body");
router.post(
  "/",
  [
    validateBody(schemas.riskValidation.risk.create),
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData(["attachments"]),
  ],
  createRisk
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getRisks
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getRisk
);

router.put(
  "/:id",
  [
    validateBody(schemas.riskValidation.risk.update),
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  editRisk
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteRisk
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteAttachment
);

router.put(
  "/:id/acceptance-rational",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  acceptRisk
);

router.put(
  "/:id/controls-mitigation",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  mitigateRisk
);

router.put(
  "/:id/escalation",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  escalateRisk
);

router.get(
  "/reports/downloads",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getRisksReport
);

router.post(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(schemas.riskValidation.isoControls.linkControls),
  ],
  linkISOControls
);

router.put(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(schemas.riskValidation.isoControls.linkControls),
  ],
  removeISOControls
);
router.post("/seeds", [], seedData);

module.exports = router;
