import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import ComplaintDetails from "./ComplaintDetails";
import Complaints from "./Complaints";

const routes = [
  {
    path: "/cqc/complaint",
    name: "Complaints",
    mini: "C",
    component: Complaints,
    screenIdentifier: "cqc-complaint",
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/complaint/:id",
    name: "Complaint",
    mini: "C",
    screenIdentifier: "cqc-complaint-detail",
    component: ComplaintDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
];

export default routes;
