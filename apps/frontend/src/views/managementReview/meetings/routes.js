import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import ScheduleReview from "./ScheduleReview";
import Index from "./detail/Index";
const routes = [
  {
    path: "/management-reviews",
    name: "Schedule",
    mini: "S",
    component: ScheduleReview,
    layout: "/admin",
    icon: "ims-icons-20 icon-icon-alarm-24",
    accessPolicy: {
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "management-review",
    authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
  },
  {
    path: "/management-reviews/:id",
    component: Index,
    layout: "/admin",
    screenIdentifier: "management-review-detail",
    accessPolicy: {
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    invisible: true,
  },
];

export default routes;
