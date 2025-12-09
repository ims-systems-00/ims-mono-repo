const governanceFilters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^3.5.*$" } },
    label: "Section-3.5 Documentation",
  },
  {
    value: { clause: { regex: "^3.6.*$" } },
    label: "Section-3.6 Evidencing Compliance",
  },
  {
    value: { clause: { regex: "^3.7.*$" } },
    label: "Section-3.7 Recommended Policies, Procedures, and SOPs",
  },
];

export default governanceFilters;
