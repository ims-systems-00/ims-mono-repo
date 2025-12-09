const express = require("express");
const router = express.Router();
const {
  createOrganisation,
  getLicenses,
  setIncidentResolutionTimes,
  getIncidentResolutionTimes,
  updateSystemDates,
  getSystemDates,
  addRreportSubscriber,
  removeRreportSubscriber,
  getRreportSubscribers,
  removeOrganisation,
  updateOrganisation,
  getOrganisation,
  updateLogo,
  getOrganisations,
  becomeACustomer,
  listUsers,
  payWithCard,
  getBillingSession,
  updateLogoRectangle,
} = require("../../controllers/organisation");
const { validate } = require("../../middleware/validator");
const validations = require("../../validations/organization");
const validateBody = validate("body");
// auth middlewares ....
const { authOrgAccess } = require("../../middleware/authOrgAccess");

router.post(
  "/",
  [validateBody(validations.createOrganizationSchema)],
  createOrganisation
);

router.post("/:id/go-live", [authOrgAccess], becomeACustomer);

router.get("/", [], getOrganisations);

router.get("/:id", [], getOrganisation);

router.put(
  "/:id",
  [validateBody(validations.updateOrganizationSchema)],
  updateOrganisation
);

router.delete("/:id", [], removeOrganisation);

router.get("/:id/licenses", [], getLicenses);

router.put("/:id/logo", [], updateLogo);

router.put("/:id/logo-rectangle", [], updateLogoRectangle);

router.get("/:id/card-payment-session", [authOrgAccess], payWithCard);

router.get("/:id/billing-session", [authOrgAccess], getBillingSession);

router.put("/:id/incident-resolutiontime", [], setIncidentResolutionTimes);

router.get("/:id/incident-resolutiontime", [], getIncidentResolutionTimes);

router.get("/:id/system-dates", [], getSystemDates);

router.put("/:id/system-dates", [], updateSystemDates);

router.get("/:id/users", [authOrgAccess], listUsers);

router.post("/:id/report-subscriptions", [], addRreportSubscriber);

router.get("/:id/report-subscriptions", [], getRreportSubscribers);

router.delete(
  "/:id/report-subscriptions/:subscription_id",
  [],
  removeRreportSubscriber
);

module.exports = router;
