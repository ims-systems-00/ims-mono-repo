import tables from "./tables";

const filters = [
  {
    value: { mitigated: { status: false } },
    label: "Open",
    tableState: tables.open,
  },
  {
    value: {
      escalated: { status: true },
      mitigated: { status: false },
      sort: "-escalated.on",
    },
    label: "Escalated",
    tableState: tables.escalated,
  },
  {
    value: { mitigated: { status: true }, sort: "-mitigated.on" },
    label: "Mitigated",
    tableState: tables.mitigated,
  },
  {
    value: { accepted: { status: true }, sort: "-accepted.on" },
    label: "Accepted",
    tableState: tables.accepted,
  },
];

export default filters;
