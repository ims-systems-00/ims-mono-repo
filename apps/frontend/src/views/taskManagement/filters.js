import { getCurrentSessionData } from "@/services/authService";
import tables from "./tables";

const filters = [
  {
    value: {
      created: { by: getCurrentSessionData()?.user?._id },
      sort: "-created.on",
    },
    label: "My tasks",
    tableState: tables.default,
  },
  {
    value: { completed: { status: "Complete" }, sort: "-completed.on" },
    label: "Complete tasks",
    tableState: tables.completed,
  },
  {
    value: {
      completed: { status: { ne: "Complete" } },
      sort: "-completed.on",
    },
    label: "Incomplete tasks",
    tableState: tables.default,
  },
  {
    value: {
      completed: { status: "In progress" },
      sort: "-completed.on",
    },
    label: "Tasks in progress",
    tableState: tables.default,
  },
  {
    value: { completed: { status: "Pending" }, sort: "-completed.on" },
    label: "Pending tasks",
    tableState: tables.default,
  },
  {
    value: {
      assignedTo: {
        elemMatch: {
          acceptance: { ne: "Declined" },
          user: getCurrentSessionData()?.user?._id,
        },
      },
    },
    label: "Tasks assigned to me",
    tableState: tables.default,
  },
];

export default filters;
