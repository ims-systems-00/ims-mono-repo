const tables = {
  default: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Job title",
      accessor: "jobTitle",
    },
    {
      Header: "User type",
      accessor: "userType",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Last logged in",
      accessor: "lastLoggedIn",
    },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  pending: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Job title",
      accessor: "jobTitle",
    },
    {
      Header: "User type",
      accessor: "userType",
    },
    {
      Header: "Status",
      accessor: "status",
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
