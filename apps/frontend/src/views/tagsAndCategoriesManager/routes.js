import Index from "./Index";
import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";

const routes = [
  {
    path: "/tags-categories",
    name: "Tags",
    mini: "S",
    component: Index,
    layout: "/admin",
    icon: "ims-icons icon-icon-alarm-24",
    accessPolicy: {
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "management-review",
    authorisedRoles: [ROLES.SUPER, ROLES.AUDITOR],
  },
  // {
  //     path: "/management-reviews/:id",
  //     component: Index,
  //     layout: "/admin",
  //     screenIdentifier: "management-review-detail",
  //     accessPolicy: {
  //         service: IMS_SERVICES.MANAGEMENT_REVIEW,
  //         action: ACTIONS.READ,
  //         effect: EFFECTS.ALLOW
  //     },
  //     authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  //     invisible: true
  // },
];

export default routes;
