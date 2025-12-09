import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Index from "./Index";
const routes = [
  {
    name: "Data import",
    icon: "ims-icons-20 icon-icon-import-24",
    path: "/data-import",
    layout: "/admin",
    component: Index,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
];

export default routes;
