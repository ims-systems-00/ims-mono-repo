import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import Premises from "./Premises";
import PremisesDetail from "./PremisesDetail";
import { ROLES } from "@/rolesAndPermissions";

const routes = [
  {
    path: "/businesspremise",
    name: "Business Premises",
    mini: "BP",
    component: Premises,
    icon: "ims-icons-20 icon-icon-storefront-24",
    layout: "/admin",
    screenIdentifier: "business-premises-sidebar",
    accessPolicy: {
      service: IMS_SERVICES.IAM_PREMISES,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/businesspremise/:id",
    name: "Business Premises",
    mini: "BP",
    component: PremisesDetail,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_PREMISES,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    auauthorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
