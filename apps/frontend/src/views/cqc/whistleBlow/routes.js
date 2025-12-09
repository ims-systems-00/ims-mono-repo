import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import WhistleBlowDetails from "./WhistleBlowDetails";
import WhistleBlows from "./WhistleBlows";

const routes = [
  {
    path: "/cqc/whistleblows",
    name: "Whistleblowing",
    mini: "W",
    component: WhistleBlows,
    screenIdentifier: "cqc-whistleblow",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/whistleblows/:id",
    name: "Whistleblowing",
    mini: "W",
    screenIdentifier: "cqc-whistleblow-detail",
    component: WhistleBlowDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
