const environmentalFilters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^1.5.*$" } },
    label: "Section-1.5 Documentation",
  },
  {
    value: { clause: { regex: "^1.6.*$" } },
    label: "Section-1.6 Evidencing Compliance",
  },
  {
    value: { clause: { regex: "^1.7.*$" } },
    label: "Section-1.7 Recommended Policies, Procedures, and SOPs",
  },
];

export default environmentalFilters;
