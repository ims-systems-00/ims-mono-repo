import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import { ROLES, LICENSES } from "@/rolesAndPermissions";
import CIP from "./ContinualImprovementPlan";
import Index from "./detail/Index";

const routes = [
  {
    name: "Improvement",
    icon: "ims-icons-20 icon-icon-arrowsquareupright-24",
    path: "/cip",
    name: "OFI",
    mini: "C",
    component: CIP,
    layout: "/admin",
    screenIdentifier: "continual-improvement-plan",
    accessPolicy: {
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.CIP,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/cip/:id",
    component: Index,
    layout: "/admin",
    screenIdentifier: "continual-improvement-plan-detail",
    accessPolicy: {
      service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: { license: LICENSES.CIP, type: LICENSES.TYPE.PARTNER },
    invisible: true,
  },
];

export default routes;
