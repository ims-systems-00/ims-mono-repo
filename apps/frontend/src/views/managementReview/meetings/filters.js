import tables from "./tables";

const filters = [
  {
    value: { completed: { status: false }, sort: "-created.on" },
    label: "Scheduled reviews",
    tableState: tables.scheduled,
  },
  {
    value: { completed: { status: true }, sort: "-created.on" },
    label: "Completed reviews",
    tableState: tables.completed,
  },
];
export default filters;
