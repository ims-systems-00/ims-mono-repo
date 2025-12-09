import customerRoutes from "@/views/crm/customers/routes";
import invoiceRoutes from "@/views/crm/invoices/routes";
import emailCampaignRoutes from "@/views/crm/emailCampaign/routes";

import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";

const routes = [
  {
    collapse: true,
    name: "CRM",
    icon: "ims-icons-20 icon-icon-handshake-24",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    licenseRequirements: {
      additionalModule: IMS_SERVICES.CRM,
    },
    state: "crmCollapse",
    views: [...customerRoutes, ...invoiceRoutes, ...emailCampaignRoutes],
  },
];

export default routes;
