import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import Index from "./Index";
const routes = [
  {
    path: "/organisation",
    name: "My organisation",
    mini: "Org",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
    },
    invisible: true,
  },
];

export default routes;
