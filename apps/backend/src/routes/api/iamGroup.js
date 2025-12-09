const express = require("express");
const router = express.Router();

// auth middlewares ....

const {
  createIamGroup,
  updateIamGroupDescription,
  getIamGroups,
  getIamGroup,
  deleteIamGroup,
  attachPolicy,
  authCreatePermission,
  useLicense,
  assignComplianceToolKit,
} = require("../../controllers/iamGroup");

const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  authCreatePermission,
  createIamGroup,
  useLicense
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getIamGroups
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getIamGroup
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateIamGroupDescription
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteIamGroup
);

router.post(
  "/:id/policies/",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  attachPolicy
);

router.put(
  "/:id/compliance-tools/",
  [
    enforceRbac({
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  assignComplianceToolKit
);

module.exports = router;
