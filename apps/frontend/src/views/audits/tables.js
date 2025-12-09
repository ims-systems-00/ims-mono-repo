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
      Header: "Compliance body",
      accessor: "complianceBody",
    },
    {
      Header: "Auditor",
      accessor: "auditors_name",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Timestamp",
      accessor: "schedule_date",
    },

    {
      Header: "Interval",
      accessor: "interval",
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
      Header: "Compliance body",
      accessor: "complianceBody",
    },
    {
      Header: "Auditor",
      accessor: "auditors_name",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Timestamp",
      accessor: "completed_date",
    },

    {
      Header: "Interval",
      accessor: "interval",
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
