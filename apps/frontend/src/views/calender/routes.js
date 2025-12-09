import { IMS_SERVICES } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { ROLES, LICENSES } from "@/rolesAndPermissions";
import Calendar from "./Calendar";

const routes = [
  {
    name: "Calendar",
    icon: "ims-icons-20 icon-icon-calendar-24",
    path: "/calendar",
    component: Calendar,
    layout: "/admin",
    screenIdentifier: "calenderevents",
    accessPolicy: {
      service: IMS_SERVICES.CALENDAR,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC],
    authorisedLicense: {
      license: LICENSES.CALENDAR,
      type: LICENSES.TYPE.PARTNER,
    },
  },
];

export default routes;
