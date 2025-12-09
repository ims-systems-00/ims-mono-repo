import { ACTIONS } from "@/rolesAndPermissions.js";
import { EFFECTS } from "@/rolesAndPermissions.js";
import { IMS_SERVICES } from "@/rolesAndPermissions.js";
import kpiObjectivesRoutes from "./kpiObjectives/routes.js";
import meetingRoutes from "./meetings/routes.js";
const routes = [
  {
    collapse: true,
    name: "Reviews",
    icon: "ims-icons-20 icon-icon-review-24",
    state: "reviewCollapse",
    accessPolicy: {
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    views: [...meetingRoutes, ...kpiObjectivesRoutes],
  },
];

export default routes;
