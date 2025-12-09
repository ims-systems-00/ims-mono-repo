import { ROLES, LICENSES } from "@/rolesAndPermissions";
import IncidentManagement from "./IncidentManagement";
import Index from "./detail/Index";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
const routes = [
  {
    name: "Incidents",
    icon: "ims-icons-20 icon-icon-circlewavywarning-24",
    path: "/incidentmanagement",
    mini: "I",
    icon: "ims-icons-20 icon-icon-warningcircle-24",
    component: IncidentManagement,
    layout: "/admin",
    screenIdentifier: "incident-management",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.INCIDENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/incidentmanagement/:id",
    component: Index,
    layout: "/admin",
    screenIdentifier: "incident-management-detail",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
