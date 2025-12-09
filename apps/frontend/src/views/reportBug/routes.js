import { ROLES, LICENSES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import ReportBug from "./ReportBug";

const routes = [
  {
    name: "Report Bug",
    icon: "ims-icons-20 icon-icon-bug-24",
    path: "/reportissue",
    component: ReportBug,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "reportBug",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.INCIDENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
  },
];

export default routes;
