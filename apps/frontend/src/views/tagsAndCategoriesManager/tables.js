const tables = {
  default: [
    // {
    //     Header: "Reference",
    //     accessor: "reference",
    // },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Applicable Modules",
      accessor: "applicableModules",
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
