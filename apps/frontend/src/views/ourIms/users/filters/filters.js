import tables from "../tables";
const filters = [
  {
    value: "",
    label: "All active users",
    default: true,
    tableState: tables.default,
  },
  {
    value: { emailVerified: { status: "pending" } },
    label: "Pending verification",
    tableState: tables.pending,
  },
  {
    value: { systemAccess: { status: "Blocked" } },
    label: "Restricted users",
    tableState: tables.pending,
  },
];
export default filters;
