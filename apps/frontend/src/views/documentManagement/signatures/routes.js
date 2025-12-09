import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import Signatures from "./Signatures";
const routes = [
  {
    name: "Signature requests",
    path: "/document-signatures/requests",
    component: Signatures,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-signature-detail",
    invisible: true,
  },
];

export default routes;
