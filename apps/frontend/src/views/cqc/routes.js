import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import complaintRoutes from "./complaints/routes";
import siteRoutes from "./sites/routes";
import reportingRoutes from "./reporting/routes";
import significantEventRoutes from "./significantEvent/routes";
import safeguardingRoutes from "./safeguarding/routes";
import whistleBlowRoutes from "./whistleBlow/routes";

const routes = [
  {
    collapse: true,
    name: "cqc",
    name: "CQC",
    icon: "ims-icons-20 icon-icon-cqc-24",
    accessPolicy: {
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    state: "cqcCollapse",
    views: [
      ...siteRoutes,
      ...complaintRoutes,
      ...whistleBlowRoutes,
      ...significantEventRoutes,
      ...safeguardingRoutes,
      ...reportingRoutes,
    ],
  },
];

export default routes;
