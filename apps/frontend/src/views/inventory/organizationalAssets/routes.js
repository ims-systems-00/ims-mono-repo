import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import OrganisationInventory from "./Organisation";
import OrganisationAssetDetails from "./OrganizationAssetsDetail/Index";

const routes = [
  {
    path: "/inventory/information",
    name: "Information",
    mini: "In",
    component: OrganisationInventory,
    icon: "ims-icons-20 icon-icon-info-24",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-organization",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/inventory/information/:id",
    component: OrganisationAssetDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "inventory-organization-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
