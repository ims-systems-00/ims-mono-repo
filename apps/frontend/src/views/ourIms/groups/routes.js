import { ROLES } from "@/rolesAndPermissions";
import Groups from "./Groups";
import GroupProfile from "./GroupProfile";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";

const routes = [
  {
    path: "/groups",
    name: "Business Units",
    mini: "BU",
    component: Groups,
    layout: "/admin",
    icon: "ims-icons-20 icon-icon-buildings-24",
    screenIdentifier: "business-unit-sidebar",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/groups/:id",
    name: "Groups",
    mini: "BU",
    component: GroupProfile,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
