const express = require("express");
const router = express.Router();
const {
  createAudit,
  getAudit,
  editAudit,
  getAudits,
  completeAudit,
  extractReport,
  removeAudit,
  addIdentification,
  updateIdentification,
  removeIdentification,
  addAttachment,
  removeAttachment,
  removeOfi,
  updateOfi,
  addOfi,
  removeRisk,
  updateRisk,
  addRisk,
  linkISOControls,
  removeISOControls,
} = require("../../controllers/audit");
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  injectAttachmentModifierMetaData,
} = require("../../middleware/injectAttachmentModifier");
const { validate } = require("../../middleware/validator");
const validateBody = validate("body");
const validationSchemas = require("../../validations");
// auth middlewares ....

router.post(
  "/",
  [
    validateBody(validationSchemas.auditValidation.audit.createAuditValidation),
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createAudit
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getAudits
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getAudit
);

router.put(
  "/:id",
  [
    validateBody(validationSchemas.auditValidation.audit.updateAuditValidation),
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  editAudit
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeAudit
);

router.post(
  "/:id/identifications",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addIdentification
);

router.put(
  "/:id/identifications/:identification_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateIdentification
);

router.delete(
  "/:id/identifications/:identification_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeIdentification
);

router.post(
  "/:id/risks",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addRisk
);

router.put(
  "/:id/risks/:risk_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateRisk
);

router.delete(
  "/:id/risks/:risk_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeRisk
);

router.post(
  "/:id/ofis",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addOfi
);

router.put(
  "/:id/ofis/:ofi_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateOfi
);

router.delete(
  "/:id/ofis/:ofi_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeOfi
);

router.post(
  "/:id/attachments/",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addAttachment
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeAttachment
);

router.post(
  "/:id/reports",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  extractReport
);

router.put(
  "/:id/accomplishment",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  completeAudit
);

router.post(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    // validateBody(schemas.riskValidation.isoControls.linkControls),
  ],
  linkISOControls
);

router.put(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    // validateBody(schemas.riskValidation.isoControls.linkControls),
  ],
  removeISOControls
);
module.exports = router;
