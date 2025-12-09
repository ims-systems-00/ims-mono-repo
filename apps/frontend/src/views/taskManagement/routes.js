import {
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
  LICENSES,
  ROLES,
} from "@/rolesAndPermissions";
import TaskDetail from "./TaskDetail/Index";
import TaskManagement from "./TaskManagement";
const routes = [
  {
    name: "Tasks",
    icon: "ims-icons-20 icon-icon-notepad-24",
    path: "/tasks",
    component: TaskManagement,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "task-manager",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC],
    authorisedLicense: {
      license: LICENSES.TASK_MANAGER,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/tasks/:id",
    component: TaskDetail,
    layout: "/admin",
    screenIdentifier: "task-manager-detail",
    accessPolicy: {
      service: IMS_SERVICES.IAM_GROUPS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC],
    authorisedLicense: {
      license: LICENSES.TASK_MANAGER,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
];

export default routes;
