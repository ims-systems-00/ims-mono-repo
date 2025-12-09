import {
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
  LICENSES,
  ROLES,
} from "@/rolesAndPermissions";
import RiskDetail from "../riskManagement/riskDetail/Index";
import RiskManagement from "./RiskManagement";

const routes = [
  {
    icon: "ims-icons-20 icon-icon-nut-24",
    path: "/risks",
    name: "Risks",
    mini: "R",
    component: RiskManagement,
    layout: "/admin",
    screenIdentifier: "risk-management",
    accessPolicy: {
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.RISK_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/risks/:id",
    component: RiskDetail,
    layout: "/admin",
    screenIdentifier: "risk-management-detail",
    accessPolicy: {
      service: IMS_SERVICES.RISK_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.RISK_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
];

export default routes;
