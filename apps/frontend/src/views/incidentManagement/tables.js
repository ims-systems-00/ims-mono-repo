const tables = {
  default: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Business unit",
      accessor: "group",
    },
    {
      Header: "Title",
      accessor: "title",
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
      Header: "Raised",
      accessor: "createdOn",
    },

    {
      Header: "Incident owner",
      accessor: "owner",
    },

    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  open: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Business unit",
      accessor: "group",
    },
    {
      Header: "Title",
      accessor: "title",
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
      accessor: "createdOn",
    },

    {
      Header: "Incident owner",
      accessor: "owner",
    },

    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  escalated: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Business unit",
      accessor: "group",
    },
    {
      Header: "Title",
      accessor: "title",
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
      accessor: "escalatedOn",
    },

    {
      Header: "Incident owner",
      accessor: "owner",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  resolved: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Business unit",
      accessor: "group",
    },
    {
      Header: "Title",
      accessor: "title",
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
      accessor: "resolvedOn",
    },

    {
      Header: "Incident owner",
      accessor: "owner",
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
