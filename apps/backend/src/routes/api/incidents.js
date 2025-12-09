const express = require("express");
const router = express.Router();

const {
  createIncident,
  getIncidents,
  getIncident,
  resolveIncident,
  editIncident,
  escalateIncident,
  deleteIncident,
  getIncidentsReport,
  deleteAttachment,
  removeISOControls,
  linkISOControls,
} = require("../../controllers/incidents");

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
const { validate } = require("../../middleware/validator");
const validations = require("../../validations/incidentManagement/");
const validateBody = validate("body");

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createIncidentValidation),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createIncident
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getIncidents
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getIncident
);

router.get(
  "/reports/downloads",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getIncidentsReport
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updateIncidentValidation),
    injectAttachmentModifierMetaData("attachments"),
  ],
  editIncident
);

router.put(
  "/:id/resolution",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  resolveIncident
);

router.put(
  "/:id/escalation",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  escalateIncident
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteAttachment
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteIncident
);
router.post(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
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
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    // validateBody(schemas.riskValidation.isoControls.linkControls),
  ],
  removeISOControls
);
module.exports = router;
