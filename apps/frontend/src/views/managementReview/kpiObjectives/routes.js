import { IMS_SERVICES } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { ROLES } from "@/rolesAndPermissions";

import KpiObjectives from "./KpiObjectives";
const routes = [
  {
    path: "/kpiobjective",
    name: "Kpi/Objectives",
    mini: "K",
    icon: "ims-icons-20 icon-icon-snowflake-24",
    component: KpiObjectives,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "kpi-objective",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.AUDITOR],
  },
];

export default routes;
