import { EFFECTS } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ROLES } from "@/rolesAndPermissions.js";
import RoleDetails from "./RoleDetails";
import Roles from "./Roles";
const routes = [
  {
    path: "/roles",
    name: "Roles",
    mini: "R",
    component: Roles,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/roles/:id",
    name: "Roles",
    mini: "R",
    component: RoleDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
