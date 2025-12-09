import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import SignificantEventDetails from "./SignificantEventDetails";
import SignificantEvents from "./SignificantEvents";

const routes = [
  {
    path: "/cqc/significantevent",
    name: "Significant Events",
    mini: "SE",
    component: SignificantEvents,
    screenIdentifier: "cqc-significantevent",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/significantevent/:id",
    name: "Significant Events",
    mini: "SE",
    screenIdentifier: "cqc-significantevent-detail",
    component: SignificantEventDetails,
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
