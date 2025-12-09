import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import EmailCampaign from "./EmailCampaign";
import Index from "./detail/Index";

const routes = [
  {
    path: "/email-campaign",
    name: "Email Campaign",
    mini: "EC",
    icon: "ims-icons-20 icon-icon-envelope-24",
    component: EmailCampaign,
    layout: "/admin",
    screenIdentifier: "email-campaign",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/email-campaign/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "customer-detail",
    invisible: true,
  },
];

export default routes;
