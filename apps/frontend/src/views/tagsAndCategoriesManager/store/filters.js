const filters = [
  {
    value: "",
    label: "All Tags",
    default: true,
  },
  {
    value: { applicableModules: "customers" },
    label: "Customer Tags",
  },
  {
    value: { applicableModules: "risks" },
    label: "Risk Management Tags",
  },
  {
    value: { applicableModules: "hardwareassets" },
    label: "Hardware asset Tags",
  },
  {
    value: { applicableModules: "softwareassets" },
    label: "Software asset Tags",
  },
  {
    value: { applicableModules: "peopleassets" },
    label: "People asset Tags",
  },
  {
    value: { applicableModules: "premiseassets" },
    label: "Premise asset Tags",
  },
  {
    value: { applicableModules: "informationassets" },
    label: "Information asset Tags",
  },
  {
    value: { applicableModules: "cips" },
    label: "CIP Tags",
  },
  {
    value: { applicableModules: "suppliers" },
    label: "Supplier Management Tags",
  },
  {
    value: { applicableModules: "incidents" },
    label: "Incident Management Tags",
  },
  {
    value: { applicableModules: "expensereports" },
    label: "Expense Reports Tags",
  },
];
export default filters;
