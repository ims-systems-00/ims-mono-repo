const express = require("express");
const router = express.Router();
const { overview } = require("../../../../controllers/documentManagement");

// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");

const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.get(
  "/overview",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  overview
);

module.exports = router;
