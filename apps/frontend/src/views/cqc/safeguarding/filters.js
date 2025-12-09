import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All safeguardings",
    default: true,
    tableState: tables.default,
  },
  {
    value: { signed: { status: false } },
    label: "Open safeguardings",
    tableState: tables.default,
  },
  {
    value: { signed: { status: true } },
    label: "Closed safeguardings",
    tableState: tables.closed,
  },
];

export default filters;
