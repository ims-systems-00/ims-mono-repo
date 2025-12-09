import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All significant events",
    default: true,
    tableState: tables.default,
  },
  {
    value: { signed: { status: false } },
    label: "Open significant events",
    tableState: tables.default,
  },
  {
    value: { signed: { status: true } },
    label: "Closed significant events",
    tableState: tables.closed,
  },
];
export default filters;
