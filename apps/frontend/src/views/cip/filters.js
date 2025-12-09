import tables from "./tables";

const filters = [
  {
    value: "",
    label: "All OFI",
    default: true,
    tableState: tables.default,
  },
  {
    value: { implemented: { status: "Pending" }, sort: { createdAt: -1 } },
    label: "Pending OFI",
    tableState: tables.default,
  },
  {
    value: { implemented: { status: "In Progress" }, sort: { createdAt: -1 } },
    label: "In progress OFI",
    tableState: tables.default,
  },
  {
    value: { implemented: { status: "Implemented" }, sort: { createdAt: -1 } },
    label: "Implemented OFI",
    tableState: tables.implemented,
  },
];

export default filters;
