import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ExpenseReportDetail from "../expenseReport/detail/Index";
import ExpenseReports from "./ExpenseReports";

const routes = [
  {
    path: "/expense-report",
    name: "Expense Report",
    mini: "ER",
    component: ExpenseReports,
    layout: "/admin",
    screenIdentifier: "expense-report",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
  },
  {
    path: "/expense-report/:id",
    component: ExpenseReportDetail,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "expense-report-detail",
    invisible: true,
  },
];

export default routes;
