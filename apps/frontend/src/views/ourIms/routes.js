import { ROLES } from "@/rolesAndPermissions";
import groupRouts from "./groups/routes";
import userRoutes from "./users/routes";
import accessPoliciesRoutes from "./policies/routes";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import premisesRouts from "./premises/routes.js";
import licenseRouts from "./licenseManagement/routes";
import systemDefaultRoutes from "./systemDefault/routes";
import organisationRoutes from "./organisation/routes";

const routes = [
  {
    collapse: true,
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    name: "Our iMS",
    icon: "ims-icons-20 icon-icon-info-24",
    screenIdentifier: "our-ims-sidebar",
    accessPolicy: {
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    state: "ourImsCollapse",
    views: [
      ...groupRouts,
      ...userRoutes,
      // ...rolesRouts,
      // ...accessPoliciesRoutes,
      ...premisesRouts,
      // ...licenseRouts,
      // ...systemDefaultRoutes,
      ...organisationRoutes,
    ],
  },
];

export default routes;
