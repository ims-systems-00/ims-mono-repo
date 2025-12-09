import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import Document from "./Index";
const routes = [
  {
    path: "/document-repositories/:id/nodes/:nodeId",
    component: Document,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-version-detail",
    invisible: true,
  },
  {
    path: "/document-repositories/:id/nodes/:nodeId",
    component: Document,
    layout: "/public",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-version-detail",
    invisible: true,
  },
];

export default routes;
