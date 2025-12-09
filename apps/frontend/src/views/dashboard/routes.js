import { ROLES } from "@/rolesAndPermissions";
import Dashboard from "./Index";
import { EFFECTS, IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const routes = [
  // main navigation routs start ....
  {
    // collapse: true,
    icon: "ims-icons-20 icon-icon-squaresfour-24",
    accessPolicy: {
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    path: "/dashboard",
    name: "Live Dashboard",
    component: Dashboard,
    layout: "/admin",
    screenIdentifier: "dashboard",

    // views: [
    //   {
    //     path: "/dashboard",
    //     name: "Live dashboard",
    //     component: Dashboard,
    //     layout: "/admin",
    //     screenIdentifier: "dashboard",
    //     accessPolicy: {
    //       service: IMS_SERVICES.DASHBOARD,
    //       action: ACTIONS.READ,
    //       effect: EFFECTS.ALLOW,
    //     },
    //     authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    //   },
    // ],
  },
];

export default routes;
