const express = require("express");
const router = express.Router();

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  sendCampaign,
  createCampaign,
  getCampaigns,
  getCampaign,
  deleteICampaign,
  updateCampaign,
  listRecipients,
  getCampaignOverView,
  closeCampaign,
} = require("../../controllers/emailCampaign");
const { injectAttachmentModifierMetaData } = require("../../middleware/injectAttachmentModifier");

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCampaign
);
router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCampaigns
);
router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCampaign
);
router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateCampaign
);
router.put(
  "/:id/schedule",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  sendCampaign
);
router.get(
  "/:id/recipients",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  listRecipients
);
router.get(
  "/:id/overview",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCampaignOverView
);
router.put(
  "/:id/activity-status",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  closeCampaign
);
router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteICampaign
);

module.exports = router;
