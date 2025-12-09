import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Wallets from "./Wallets";

const routes = [
  {
    path: "/wallets",
    name: "Staff Wallets",
    mini: "SW",
    icon: "icon-icon-cardholder-24",
    component: Wallets,
    layout: "/admin",
    screenIdentifier: "wallets",
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    },
  },
];

export default routes;
