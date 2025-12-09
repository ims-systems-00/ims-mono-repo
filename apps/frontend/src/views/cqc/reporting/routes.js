import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Report from "./Report";
import ReportHistory from "./ReportHistory";

const routes = [
  {
    path: "/cqc/reports",
    name: "Reports",
    mini: "R",
    component: ReportHistory,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/reports/:id",
    name: "Site",
    mini: "S",
    component: Report,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
