import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
const routes = [
  {
    path: "/integrations/xero",
    name: "Xero",
    mini: "H",
    icon: "ims-icons-20 icon-icon-cpu-24",
    component: RiskManagement,
    layout: "/admin",
    screenIdentifier: "hardware-risk-management",
    accessPolicy: {
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
];

export default routes;
