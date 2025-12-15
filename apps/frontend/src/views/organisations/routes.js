import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import Organisation from "./organisations";
const routes = [
  {
    icon: "ims-icons-20 icon-icon-nut-24",
    path: "/organisation",
    name: "Organisation",
    mini: "O",
    component: Organisation,
    layout: "/systemadmin",
    screenIdentifier: "organisation",
    accessPolicy: {
      service: IMS_SERVICES.ORGANISATIONS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [
      ROLES.BASIC_USER,
      ROLES.SUPER_ADMIN,
      ROLES.HOS,
      ROLES.AUDITOR,
    ],
  },
];

export default routes;
