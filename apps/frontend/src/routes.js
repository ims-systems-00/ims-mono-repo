import dashboardRouts from "@/views/dashboard/routes.js";
import inventoryRoutes from "@/views/inventory/routes.js";
import riskManagementRoutes from "@/views/riskManagement/routes.js";
import incidentManagementRoutes from "@/views/incidentManagement/routes.js";
import auditRoutes from "@/views/audits/routes.js";
import cipRoutes from "@/views/cip/routes.js";
import complainceToolRoutes from "@/views/compliance/routes.js";
import supplierManagementRoutes from "@/views/supplierManagement/routes.js";
import documentManagementRoutes from "@/views/documentManagement/routes.js";
import filePreviewRoutes from "@/views/filePreview/routes.js";
import taskManagementRoutes from "@/views/taskManagement/routes.js";
import calenderRoutes from "@/views/calender/routes.js";
import managementReviewRoutes from "@/views/managementReview/routes.js";
import authRoutes from "@/views/auth/routes.js";
import ourImsRoutes from "@/views/ourIms/routes.js";
import crmRoutes from "@/views/crm/routes.js";
import reportBugRoutes from "@/views/reportBug/routes.js";
import notificaionRedirectRoutes from "@/views/notificationRedirect/routes.js";
import onboardingRoutes from "@/views/onboarding/routes.js";
import partnershipRoutes from "@/views/partnership/routes.js";
import dataImportRoutes from "@/views/dataImport/routes.js";
import exampleRoutes from "@/views/_public_page_example/routes.js";
import toursRoutes from "@/views/guidelines/routes.js";

const routes = [
  // main navigation routs start ....
  ...dashboardRouts,
  ...ourImsRoutes,
  ...documentManagementRoutes,
  // ...staffWalletRoutes,
  ...inventoryRoutes,
  ...riskManagementRoutes,
  ...incidentManagementRoutes,
  ...auditRoutes,
  ...managementReviewRoutes,
  ...cipRoutes,
  // ...cqcRoutes,
  ...complainceToolRoutes,
  ...crmRoutes,
  ...supplierManagementRoutes,
  ...notificaionRedirectRoutes,
  ...taskManagementRoutes,
  ...calenderRoutes,
  ...authRoutes,
  ...reportBugRoutes,
  ...filePreviewRoutes,
  ...dataImportRoutes,
  ...exampleRoutes,
  ...toursRoutes,
  ...onboardingRoutes,
  ...partnershipRoutes,
];

export default routes;
