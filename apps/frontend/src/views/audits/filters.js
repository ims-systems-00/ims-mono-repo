import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All audits",
    default: true,
    tableState: tables.default,
  },
  {
    value: { completed: { status: false }, sort: "startDate" },
    label: "Scheduled audits",
    tableState: tables.default,
  },
  {
    value: { completed: { status: true }, sort: "-completed.on" },
    label: "Completed audits",
    tableState: tables.completed,
  },
];

export default filters;
