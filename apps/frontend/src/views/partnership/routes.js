import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import Partnership from "./Index";
const routes = [
  {
    path: "/partnership-dashboard",
    name: "My partnership",
    mini: "Org",
    component: Partnership,
    layout: "/partner",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
    },
    invisible: true,
  },
];

export default routes;
