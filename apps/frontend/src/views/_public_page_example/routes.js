import Example from "./Example";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
const routes = [
  {
    path: "/someroute",
    name: "Route for title",
    invisible: true,
    component: Example,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/public",
  },
];

export default routes;
