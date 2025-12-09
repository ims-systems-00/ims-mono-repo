const express = require("express");
const expressApp = express();
const { deserializeUser } = require("../middleware/deserializeUser");
const { authOrgAccess } = require("../middleware/authOrgAccess");

const { devUtils } = require("../middleware/devUtils");
const { dynamicModelCompiler } = require("../middleware/dynamicModelComplier");

const router = express.Router();
function getUserRouter() {
  router.use("/tenants", require("../routes/api/tenants"));
  router.use("/contactims", require("../routes/api/contactIms"));
  router.use(
    "/register-public-interest",
    require("../routes/api/registerPublicInterest/registerPublicInterest")
  );
  router.use("/auth", require("../routes/api/v3auth"));
  router.use(deserializeUser);
  router.use(dynamicModelCompiler);
  router.use(devUtils);
  router.use("/memberships", require("../routes/api/membership"));
  router.use("/organizations", require("../routes/api/organizations"));
  router.use("/invitations", require("../routes/api/invitation"));
  router.use("/users", require("../routes/api/users"));
  router.use("/ims-partnership", require("../routes/api/partnershipProgram"));
  router.use("/files", require("../routes/api/fileHandler"));
  router.use(authOrgAccess);
  router.use("/dashboards", require("../routes/api/dashboard"));
  router.use("/wallets", require("../routes/api/wallets"));
  router.use("/suppliers", require("../routes/api/suppliers"));
  router.use("/risks", require("../routes/api/risks"));
  router.use("/audits", require("../routes/api/audits"));
  router.use("/managementreviews", require("../routes/api/managementReview"));
  router.use("/kpiobjectives", require("../routes/api/kpiObjectives"));
  router.use("/cips", require("../routes/api/cip"));
  router.use("/assets", require("../routes/api/assets"));
  router.use("/incidents", require("../routes/api/incidents"));
  router.use(
    "/document-management",
    require("../routes/api/documentManagement/misc")
  );
  router.use(
    "/document-trees",
    require("../routes/api/documentManagement/documenttree")
  );
  router.use(
    "/document-repositories",
    require("../routes/api/documentManagement/repositories")
  );
  router.use(
    "/document-signatures",
    require("../routes/api/documentManagement/signatures")
  );
  router.use("/ai", require("../routes/api/ai"));
  router.use("/charts", require("../routes/api/charts"));
  router.use("/cc", require("../routes/api/cc"));
  router.use("/compliances", require("../routes/api/compliance"));
  router.use("/cqc", require("../routes/api/cqc"));
  router.use("/crm", require("../routes/api/crm"));
  router.use("/customers", require("../routes/api/customers"));
  router.use("/invoices", require("../routes/api/invoices"));
  router.use("/tasks", require("../routes/api/task"));
  router.use("/events", require("../routes/api/calenderEvent"));
  router.use("/notifications", require("../routes/api/notifications"));
  router.use("/ims-forms", require("../routes/api/imsForm"));
  router.use("/ims-projects", require("../routes/api/imsProject"));
  router.use("/iam-groups", require("../routes/api/iamGroup"));
  router.use("/iam-roles", require("../routes/api/iamRole"));
  router.use("/iam-policies", require("../routes/api/iamPolicy"));
  router.use("/iam-group-premises", require("../routes/api/iamGroupPremises"));
  router.use(
    "/license-requests",
    require("../routes/api/licenseRequest/licenseRequest")
  );
  router.use("/activities", require("../routes/api/activity"));
  router.use("/emailcampaign", require("../routes/api/emailCampaign"));
  router.use("/jira-integration", require("../routes/api/jiraIntegration"));
  router.use("/data-import", require("../routes/api/dataImport"));
  router.use("/statics", require("../routes/api/statics"));
  router.use("/stats", require("../routes/api/stats"));
  router.use(
    "/tags-and-categories",
    require("../routes/api/tagsAndCategories")
  );
  router.use("/attachments", require("../routes/api/attachment"));
  router.use("/txn-emails", require("../routes/api/txnEMail/"));
  return router;
}

/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  app.use("/api/v3", getUserRouter());
};
