import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import HardwareInventory from "./Hardware";
import HardwareAssetDetails from "./HardwareAssetsDetail/Index";

const routes = [
  {
    path: "/inventory/hardware",
    name: "Hardware",
    mini: "H",
    icon: "ims-icons-20 icon-icon-cpu-24",
    component: HardwareInventory,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-hardware",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/inventory/hardware/:id",
    component: HardwareAssetDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-hardware-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
