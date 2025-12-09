import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ExpenseReports from "../expenseReport/ExpenseReports";
import expenseReportsRoutes from "../expenseReport/routes";
import Leaves from "../leaves/Leaves";
import leavesRoutes from "../leaves/routes";
import WorkLogs from "../workLog/WorkLogs";

const routes = [
  {
    collapse: true,
    name: "My Wallet",
    icon: "ims-icons-20 icon-icon-wallet-24",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    views: [
      {
        path: "/expense-report",
        name: "Expense Report",
        mini: "ER",
        icon: "ims-icons-20 icon-icon-money-24",
        component: ExpenseReports,
        layout: "/admin",
        screenIdentifier: "expense-report",
        accessPolicy: {
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
      },
      {
        path: "/leaves",
        name: "Leaves",
        mini: "L",
        icon: "ims-icons-20 icon-icon-bagsimple-24",
        component: Leaves,
        layout: "/admin",
        screenIdentifier: "leaves",
        accessPolicy: {
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
      },
      {
        path: "/work-log",
        name: "Work Log",
        mini: "WL",
        icon: "ims-icons-20 icon-icon-computertower-24",
        component: WorkLogs,
        layout: "/admin",
        screenIdentifier: "work-log",
        accessPolicy: {
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
      },
    ],
  },
  ...expenseReportsRoutes,
  ...leavesRoutes,
];

export default routes;
