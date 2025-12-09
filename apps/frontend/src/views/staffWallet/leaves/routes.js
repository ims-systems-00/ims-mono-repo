import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import Index from "./detail/Index";
import Leaves from "./Leaves";

const routes = [
  {
    path: "/leaves",
    name: "Leaves",
    mini: "L",
    component: Leaves,
    layout: "/admin",
    screenIdentifier: "leaves",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
  {
    path: "/leaves/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "leave-request-detail",
    invisible: true,
  },
];

export default routes;
