const express = require("express");
const router = express.Router();
const {
  createCustomer,
  removeAttchment,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOverview,
  getAccountManagerOverview,
} = require("../../controllers/customers");

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
      service: IMS_SERVICES.CRM,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCustomer
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
  getCustomers
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
  getCustomer
);

router.get(
  "/:id/overviews",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCustomerOverview
);

router.get(
  "/analytics/manageroverview/:managerId",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getAccountManagerOverview
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateCustomer
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
  deleteCustomer
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeAttchment
);

module.exports = router;
