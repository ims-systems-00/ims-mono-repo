import Invoices from "./Invoices";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Index from "./detail/Index";

const routes = [
  {
    path: "/invoices",
    name: "Invoices",
    mini: "INv",
    component: Invoices,
    layout: "/admin",
    screenIdentifier: "invoices",
    invisible: true,
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/invoices/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "invoice-detail",
    invisible: true,
  },
];

export default routes;
