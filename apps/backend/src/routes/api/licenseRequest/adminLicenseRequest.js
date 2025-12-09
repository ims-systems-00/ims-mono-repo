const router = require("express").Router();

// auth middlewares ....

const {
  cancelLicenseRequest,
  approveLicenseRequest
} = require("../../../controllers/licenseRequest/adminLicenseRequest");

const  checkImsAdmin  = require("../../../middleware/checkImsAdmin");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post("/:id/cancel", [checkImsAdmin], cancelLicenseRequest);
router.post("/:id/approve", [checkImsAdmin], approveLicenseRequest);

module.exports = router;
