const express = require("express");
const router = express.Router();
const {
  checkPendingApproval,
  checkDocumentOwnership,
  checkDocumentProcessRequirements,
} = require("../../../../controllers/documentManagement");
// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.get(
  "/:id/checks/pending-node",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  checkPendingApproval
);
router.get(
  "/:id/checks/document-ownership",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  checkDocumentOwnership
);
router.get(
  "/:id/checks/process-requirements",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  checkDocumentProcessRequirements
);
module.exports = router;
