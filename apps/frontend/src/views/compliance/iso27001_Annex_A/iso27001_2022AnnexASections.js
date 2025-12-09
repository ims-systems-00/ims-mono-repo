const filters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^5.*$" } },
    label: "Section-5 Organisational controls",
  },
  {
    value: { clause: { regex: "^6.*$" } },
    label: "Section-6 People controls",
  },
  {
    value: { clause: { regex: "^7.*$" } },
    label: "Section-7 Physical controls",
  },
  {
    value: { clause: { regex: "^8.*$" } },
    label: "Section-8 Technological controls",
  },
];

export default filters;
