const express = require("express");
const router = express.Router();

const {
  createCip,
  getCip,
  removeCip,
  getCips,
  editCip,
  implementCip,
  deleteAttachment,
  linkISOControls,
  removeISOControls,
} = require("../../controllers/cip");
const { validate } = require("../../middleware/validator");
const validations = require("../../validations/");
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

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.cipValidation.createValidation),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCip
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.cipValidation.updateValidation),
    injectAttachmentModifierMetaData("attachments"),
  ],
  editCip
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCips
);

router.get(
  "/:id/",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCip
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeCip
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteAttachment
);

router.put(
  "/:id/implementation",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  implementCip
);

router.post(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  linkISOControls
);

router.put(
  "/:id/iso-controls",
  [
    enforceRbac({
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeISOControls
);

module.exports = router;
