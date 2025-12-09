import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All whistleblowing",
    default: true,
    tableState: tables.default,
  },
  {
    value: { signed: { status: false } },
    label: "Open whistleblowing",
    tableState: tables.default,
  },
  {
    value: { signed: { status: true } },
    label: "Closed whistleblowing",
    tableState: tables.closed,
  },
];

export default filters;
