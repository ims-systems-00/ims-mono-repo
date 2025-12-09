const filters = [
  {
    value: "",
    label: "Full toolkit",
    default: true,
  },
  {
    value: { clause: { regex: "^4.*$" } },
    label: "Section-4 Context of the organisation",
  },
  {
    value: { clause: { regex: "^5.*$" } },
    label: "Section-5 Leadership",
  },
  {
    value: { clause: { regex: "^6.*$" } },
    label: "Section-6 Planning",
  },
  {
    value: { clause: { regex: "^7.*$" } },
    label: "Section-7 Support",
  },
  {
    value: { clause: { regex: "^8.*$" } },
    label: "Section-8 Operation",
  },
  {
    value: { clause: { regex: "^9.*$" } },
    label: "Section-9 Performance evaluation",
  },
  {
    value: { clause: { regex: "^10.*$" } },
    label: "Section-10 Improvement",
  },
];

export default filters;
