const tables = {
  default: [
    {
      Header: "Reference",
      accessor: "reference",
    },
    {
      Header: "Business unit",
      accessor: "business_function",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Raised",
      accessor: "created_on",
    },
    {
      Header: "Assigned owner",
      accessor: "assign_owner",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  implemented: [
    {
      Header: "Reference",
      accessor: "reference",
    },
    {
      Header: "Business unit",
      accessor: "business_function",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Implemented",
      accessor: "implementedOn",
    },
    {
      Header: "Assigned owner",
      accessor: "assign_owner",
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
