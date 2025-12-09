import { ROLES, LICENSES } from "@/rolesAndPermissions";
import SupplierManagement from "./SupplierManagement";
import Index from "./detail/Index";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";

const routes = [
  {
    name: "Suppliers",
    icon: "ims-icons-20 icon-icon-supply-24",
    path: "/suppliermanagement",
    mini: "S",
    component: SupplierManagement,
    layout: "/admin",
    screenIdentifier: "supplier-management",
    accessPolicy: {
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.SUPPLIER_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/suppliermanagement/:id",
    component: Index,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "supplier-management-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.RISK_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
];

export default routes;
