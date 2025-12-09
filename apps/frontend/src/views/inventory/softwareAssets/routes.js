import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import SoftwareInventory from "./Software";
import SoftwareAssetDetails from "./SoftwareAssetsDetail/Index";
const routes = [
  {
    path: "/inventory/software",
    name: "Software",
    mini: "S",
    component: SoftwareInventory,
    layout: "/admin",
    icon: "ims-icons-20 icon-icon-command-24",
    screenIdentifier: "inventory-software",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/inventory/software/:id",
    component: SoftwareAssetDetails,
    layout: "/admin",
    screenIdentifier: "inventory-software-detail",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
