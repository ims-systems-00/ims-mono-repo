import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import PremisesDetails from "./PremiseAssetsDetail/Index";
import PremisesInventory from "./Premises";
const routes = [
  {
    path: "/inventory/premise",
    name: "Premises",
    mini: "Pr",
    component: PremisesInventory,
    icon: "ims-icons-20 icon-icon-storefront-24",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-premise",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/inventory/premise/:id",
    component: PremisesDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-premise-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
