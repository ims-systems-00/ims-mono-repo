import tables from "./tables";

const filters = [
  {
    value: { resolved: { status: false } },
    label: "Open",
    tableState: tables.open,
  },
  {
    value: {
      escalated: { status: true },
      resolved: { status: false },
      sort: "-escalated.on",
    },
    label: "Escalated",
    tableState: tables.escalated,
  },
  {
    value: { resolved: { status: true }, sort: "-resolved.on" },
    label: "Resolved",
    tableState: tables.resolved,
  },
];
export default filters;
