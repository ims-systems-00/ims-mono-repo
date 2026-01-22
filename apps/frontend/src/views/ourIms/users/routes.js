import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ToolAccess from "./ToolAccess";
import Users from "./Users";
import Index from "./detail/Index";
const routes = [
  {
    path: "/users",
    name: "Users",
    mini: "U",
    component: Users,
    icon: "ims-icons-20 icon-icon-user-24",
    layout: "/admin",
    screenIdentifier: "our-ims-users",
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/users/:id",
    name: "Users",
    mini: "U",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
  {
    path: "/users/:id/tools",
    name: "Toolkit",
    mini: "T",
    component: ToolAccess,
    layout: "/admin",
    referenceName: "users",
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
