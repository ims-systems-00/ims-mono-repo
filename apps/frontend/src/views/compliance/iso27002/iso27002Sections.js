const filters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^5.*$" } },
    label: "Section-5 Information security policies",
  },
  {
    value: { clause: { regex: "^6.*$" } },
    label: "Section-6 Organisation of information security",
  },
  {
    value: { clause: { regex: "^7.*$" } },
    label: "Section-7 Human resource security",
  },
  {
    value: { clause: { regex: "^8.*$" } },
    label: "Section-8 Asset management",
  },
  {
    value: { clause: { regex: "^9.*$" } },
    label: "Section-9 Access control",
  },
  {
    value: { clause: { regex: "^10.*$" } },
    label: "Section-10 Cryptography",
  },
  {
    value: { clause: { regex: "^11.*$" } },
    label: "Section-11 Physical and environmental security",
  },
  {
    value: { clause: { regex: "^12.*$" } },
    label: "Section-12 Operations security",
  },
  {
    value: { clause: { regex: "^13.*$" } },
    label: "Section-13 Communications security",
  },
  {
    value: { clause: { regex: "^14.*$" } },
    label: "Section-14 System acquisition, development and maintenance",
  },
  {
    value: { clause: { regex: "^15.*$" } },
    label: "Section-15 Supplier relationships",
  },
  {
    value: { clause: { regex: "^16.*$" } },
    label: "Section-16 Information security incident management",
  },
  {
    value: { clause: { regex: "^17.*$" } },
    label:
      "Section-17 Information security aspects of business continuity management",
  },
  {
    value: { clause: { regex: "^18.*$" } },
    label: "Section-18 Compliance",
  },
];

export default filters;
