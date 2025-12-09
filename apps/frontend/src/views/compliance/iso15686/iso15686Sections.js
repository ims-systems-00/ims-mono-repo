const filters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^4.*$" } },
    label: "Section-4 Principles of life-cycle costing",
  },
  {
    value: { clause: { regex: "^5.*$" } },
    label: "Section-5 Setting the scope for LCC analysis",
  },
  {
    value: { clause: { regex: "^6.*$" } },
    label: "Section-6 WLC variables used in some investment appraisals",
  },
  {
    value: { clause: { regex: "^7.*$" } },
    label: "Section-7 Decision variables — Basis of calculating costs",
  },
  {
    value: { clause: { regex: "^8.*$" } },
    label: "Section-8 Uncertainty and risks",
  },
  {
    value: { clause: { regex: "^9.*$" } },
    label: "Section-9 Reporting",
  },
];

export default filters;
