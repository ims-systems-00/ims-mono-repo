const tables = {
  default: [
    {
      Header: "Reference",
      accessor: "reference",
    },
    {
      Header: "Task",
      accessor: "name",
    },
    {
      Header: "Assigned to",
      accessor: "assignedTo",
    },
    {
      Header: "Priority",
      accessor: "priority",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Due date",
      accessor: "due",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  completed: [
    {
      Header: "Reference",
      accessor: "reference",
    },
    {
      Header: "Task",
      accessor: "name",
    },
    {
      Header: "Assigned to",
      accessor: "assignedTo",
    },
    {
      Header: "Priority",
      accessor: "priority",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Date",
      accessor: "completed_on",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
};
export default tables;
