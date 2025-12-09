import {
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
  LICENSES,
  ROLES,
} from "@/rolesAndPermissions";
import Repository from "./Repository.jsx";
const routes = [
  {
    path: "/document-repositories/:id",
    component: Repository,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-management-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.DOCUMENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
];

export default routes;
