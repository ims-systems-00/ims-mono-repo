import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All complaints",
    default: true,
    tableState: tables.default,
  },
  {
    value: { signed: { status: false } },
    label: "Open complaints",
    tableState: tables.default,
  },
  {
    value: { signed: { status: true } },
    label: "Closed complaints",
    tableState: tables.closed,
  },
];
export default filters;
