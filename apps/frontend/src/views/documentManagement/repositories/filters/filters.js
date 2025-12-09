import { getCurrentSessionData } from "@/services/authService";

const filters = [
  {
    value: {},
    label: "All Repositories",
    default: true,
  },
  {
    value: { privacy: "Organisational", sort: "-created.on" },
    label: "Organisational",
  },
  {
    value: { privacy: "Business unit", sort: "-created.on" },
    label: "Business unit",
  },
  {
    value: {
      privacy: "Custom",
      sharedWith: getCurrentSessionData()?.user?._id,
      sort: "-created.on",
    },
    label: "Shared with me",
  },
  {
    value: { privacy: "Only me", sort: "-created.on" },
    label: "Only me",
  },
];

export default filters;
