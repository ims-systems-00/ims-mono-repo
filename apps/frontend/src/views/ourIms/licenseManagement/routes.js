import { ROLES } from "@/rolesAndPermissions";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Licenses from "./Licenses";
import ManageLicense from "./ManageLicense";

const routes = [
  {
    path: "/licensemanagement",
    name: "Licence Management",
    mini: "L",
    component: Licenses,
    icon: "ims-icons-20 icon-icon-medal-24",
    layout: "/admin",
    screenIdentifier: "license-management",
    accessPolicy: {
      service: IMS_SERVICES.LICENSE_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/licensemanagement/:groupId",
    name: "LICENCE MANAGEMENT",
    mini: "L",
    component: ManageLicense,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.LICENSE_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
