const express = require("express");
const expressApp = express();
const adminUserDeserialization = require("../middleware/adminUserDeserialization");
const { dynamicModelCompiler } = require("../middleware/dynamicModelComplier");

const router = express.Router();
function getAdminRouter() {
  router.use("/", require("../routes/api/adminAuth"));
  router.use(dynamicModelCompiler);
  router.use(adminUserDeserialization);
  router.use(
    "/ims-partnership",
    require("../routes/api/partnershipProgram/adminPartnershipProgram")
  );
  router.use(
    "/ims-license-request",
    require("../routes/api/licenseRequest/adminLicenseRequest")
  );
  router.use(
    "/organizations",
    require("../routes/api/organisation/adminOrganisation")
  );
  return router;
}

/**
 *
 * @param {expressApp} app
 */
module.exports = function (app) {
  app.use("/admin", getAdminRouter());
};
