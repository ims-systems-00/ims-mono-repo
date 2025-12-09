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
      Header: "Complainant",
      accessor: "name",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Created on",
      accessor: "date",
    },
    {
      Header: "Created by",
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
      Header: "Complainant",
      accessor: "name",
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
