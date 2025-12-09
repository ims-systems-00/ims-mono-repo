import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Safeguarding from "./Safeguarding";
import Safeguradings from "./Safeguardings";
const routes = [
  {
    path: "/cqc/safeguardings",
    name: "Safeguarding",
    mini: "S",
    component: Safeguradings,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/safeguardings/:id",
    name: "Safeguarding",
    mini: "S",
    component: Safeguarding,
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
