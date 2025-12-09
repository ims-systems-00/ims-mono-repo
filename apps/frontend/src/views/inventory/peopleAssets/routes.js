import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import PeopleInventory from "./People";
import PeopleAssetDetails from "./PeopleAssetsDetail/Index";

const routes = [
  {
    path: "/inventory/people",
    name: "People",
    mini: "Pe",
    icon: "ims-icons-20 icon-icon-user-24",
    component: PeopleInventory,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-people",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/inventory/people/:id",
    component: PeopleAssetDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-people-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
