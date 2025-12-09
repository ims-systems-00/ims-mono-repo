import { ROLES, LICENSES } from "@/rolesAndPermissions";
import CRM from "./CRM";
import Index from "./detail/Index";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import MyCRMOverviewIndex from "./Analytics/MyCRMOverviewIndex";

const routes = [
  {
    path: "/customers/overview",
    name: "MY CRM",
    mini: "CU",
    component: MyCRMOverviewIndex,
    icon: "ims-icons-20 icon-icon-notebook-24",
    layout: "/admin",
    screenIdentifier: "customers",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/customers",
    name: "Customers",
    mini: "CU",
    component: CRM,
    icon: "ims-icons-20 icon-icon-arrowelbowright-24",
    layout: "/admin",
    screenIdentifier: "customers",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/customers/:id",
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
