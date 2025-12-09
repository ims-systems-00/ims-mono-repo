import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import { ROLES } from "@/rolesAndPermissions";
import Policies from "./Policies";
import Policy from "./Policy";

const routes = [
  {
    path: "/access-policies",
    name: "Access Policies",
    mini: "A",
    component: Policies,
    icon: "ims-icons-20 icon-icon-shieldchevron-24",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_ACCESS_POLICIES,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/access-policies/:id",
    name: "Access Policies",
    mini: "P",
    component: Policy,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_ACCESS_POLICIES,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
