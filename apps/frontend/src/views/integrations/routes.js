import {
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
  LICENSES,
  ROLES,
} from "@/rolesAndPermissions";
const routes = [
  {
    collapse: true,
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
    name: "Risk Management",
    icon: "ims-icons-20 icon-icon-nut-24",
    state: "riskCollapse",
    views: [
      {
        path: "/integrations/xero",
        name: "Xero",
        mini: "H",
        icon: "ims-icons-20 icon-icon-cpu-24",
        component: RiskManagement,
        layout: "/admin",
        screenIdentifier: "hardware-risk-management",
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
    ],
  },
];

export default routes;
