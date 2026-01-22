import hardwareInventoryRoutes from "./hardwareAssets/routes";
import softwareInventoryRoutes from "./softwareAssets/routes";
import peopleInventoryRoutes from "./peopleAssets/routes";
import premiseInventoryRoutes from "./premiseAssets/routes";
import organisationInventoryRoutes from "./organizationalAssets/routes";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";

const routes = [
  {
    collapse: true,
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    name: "Inventory",
    icon: "ims-icons-20 icon-icon-cube-24",
    state: "inventoryCollapse",
    screenIdentifier: "inventory-sidebar",
    views: [
      ...hardwareInventoryRoutes,
      ...softwareInventoryRoutes,
      ...peopleInventoryRoutes,
      ...premiseInventoryRoutes,
      ...organisationInventoryRoutes,
    ],
  },
];

export default routes;
