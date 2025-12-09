const router = require("express").Router();
const checkImsAdmin = require("../../../middleware/checkImsAdmin");
const {
  adminAlertOrganisationForPayment,
  adminBlockOrganisation,
  adminReactivateOrganisation,
} = require("../../../controllers/organisation");

router.put(
  "/:id/past-due-alert",
  [checkImsAdmin],
  adminAlertOrganisationForPayment
);
router.put(
  "/:id/temporary-suspension",
  [checkImsAdmin],
  adminBlockOrganisation
);
router.put("/:id/reactivation", [checkImsAdmin], adminReactivateOrganisation);

module.exports = router;
