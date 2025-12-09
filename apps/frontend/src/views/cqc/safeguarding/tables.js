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
      Header: "Person affected",
      accessor: "personAffected",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Reported on",
      accessor: "date",
    },
    {
      Header: "Reported by",
      accessor: "createdBy",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  closed: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Business unit",
      accessor: "group",
    },
    {
      Header: "Person affected",
      accessor: "personAffected",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Closed by",
      accessor: "closedBy",
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
