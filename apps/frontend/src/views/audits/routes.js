import { ROLES, LICENSES } from "@/rolesAndPermissions";
import ScheduleAudit from "./ScheduleAudit";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import Index from "./detail/Index";

const routes = [
  {
    collapse: true,
    authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
    accessPolicy: {
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedLicense: { license: LICENSES.AUDIT, type: LICENSES.TYPE.PARTNER },
    name: "Audits",
    icon: "ims-icons-20 icon-icon-clipboardtext-24",
    state: "auditCollapse",
    views: [
      {
        path: "/audits/internal",
        name: "Internal",
        mini: "I",
        icon: "ims-icons-20 icon-icon-arrowsin-24",
        component: ScheduleAudit,
        layout: "/admin",
        screenIdentifier: "internal-audit",
        accessPolicy: {
          service: IMS_SERVICES.AUDIT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
      },
      {
        path: "/audits/external",
        name: "External",
        mini: "E",
        icon: "ims-icons-20 icon-icon-arrowsout-24",
        component: ScheduleAudit,
        layout: "/admin",
        accessPolicy: {
          service: IMS_SERVICES.AUDIT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        screenIdentifier: "external-audit",
        authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
      },
    ],
  },
  {
    path: "/audits/internal/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "internal-audit-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
    invisible: true,
  },
  {
    path: "/audits/external/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "external-audit-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
