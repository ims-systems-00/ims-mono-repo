import { getCurrentSessionData } from "@/services/authService";
import tables from "./tables";
const filters = [
  {
    value: "",
    label: "All customers",
    tableState: tables.default,
    default: true,
  },
  {
    value: {
      accountManager:
        getCurrentSessionData() && getCurrentSessionData().user._id,
      sort: { createdAt: -1 },
    },
    label: "My customers",
    tableState: tables.myCustomer,
  },
  {
    value: { stage: "Live", sort: { createdAt: -1 } },
    label: "Live customers",
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
