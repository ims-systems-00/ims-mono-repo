import tables from "./tables";
const filters = [
  {
    value: "",
    label: "All",
    default: true,
    tableState: tables.default,
  },
  {
    value: { stage: "Live", sort: { createdAt: -1 } },
    label: "Customers live",
    tableState: tables.customers,
  },
  {
    value: { stage: "Prospect", sort: { createdAt: -1 } },
    label: "Prospects",
    tableState: tables.prospects,
  },
  {
    value: { stage: "Warm lead", sort: { createdAt: -1 } },
    label: "Warm leads",
    tableState: tables.warmleads,
  },
  {
    value: { stage: "Qualified", sort: { createdAt: -1 } },
    label: "Qualified",
    tableState: tables.qualified,
  },
  {
    value: { stage: "Proposal", sort: { createdAt: -1 } },
    label: "Proposals",
    tableState: tables.proposals,
  },
];
export default filters;
