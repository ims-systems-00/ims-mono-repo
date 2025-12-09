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
      Header: "Created by",
      accessor: "createdBy",
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
      Header: "Reported To",
      accessor: "reportedTo",
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
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Created by",
      accessor: "createdBy",
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
