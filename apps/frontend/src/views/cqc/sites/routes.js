import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import SiteDetails from "./SiteDetails";
import SiteManagement from "./SiteManagement";
import ToolControlDetails from "./ToolControlDetails";

const routes = [
  {
    path: "/cqc/overviews",
    name: "Site",
    mini: "S",
    component: SiteManagement,
    layout: "/admin",
    globalAccessCheck: true,
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  },
  {
    path: "/cqc/overviews/:id/:groupId",
    name: "Site",
    mini: "S",
    component: SiteDetails,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
    screenIdentifier: "cqc-overview",
  },
  {
    path: "/cqc/controls/:id/",
    name: "Site",
    mini: "S",
    component: ToolControlDetails,
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
