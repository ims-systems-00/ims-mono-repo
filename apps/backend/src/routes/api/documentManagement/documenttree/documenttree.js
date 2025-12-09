const express = require("express");
const router = express.Router();
// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");

const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { listNodesByOrg } = require("../../../../controllers/documentManagement");

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  listNodesByOrg
);

module.exports = router;
