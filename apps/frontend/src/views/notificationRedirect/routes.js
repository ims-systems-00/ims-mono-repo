import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import Redirect from "./Redirect";
const routes = [
  {
    path: "/notificaion-redirection",
    name: "Notifications",
    component: Redirect,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
