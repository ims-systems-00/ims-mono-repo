import { IMS_SERVICES, ACTIONS, ROLES, EFFECTS } from "@/rolesAndPermissions";
import Subscriptions from "./SystemDefaults";
const routes = [
  {
    path: "/organisation",
    name: "System Defaults",
    mini: "S",
    component: Subscriptions,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
