const socialFilters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^2.6.*$" } },
    label: "Section-2.6 Documentation",
  },
  {
    value: { clause: { regex: "^2.7.*$" } },
    label: "Section-2.7 Evidencing Compliance",
  },
  {
    value: { clause: { regex: "^2.8.*$" } },
    label: "Section-2.8 Recommended Policies, Procedures, and SOPs",
  },
];

export default socialFilters;
