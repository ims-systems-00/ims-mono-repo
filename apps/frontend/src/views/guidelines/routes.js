import {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
  ROLES,
} from "@/rolesAndPermissions.js";
import Guidelines from "./Guidelines.jsx";

const routes = [
  {
    name: "Guidelines",
    icon: "ims-icons-20 icon-icon-stack-20",
    path: "/guidelines",
    component: Guidelines,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "tour-manager",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC],
    invisible: true,
  },
];

export default routes;
