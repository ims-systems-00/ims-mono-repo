const tables = {
  default: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Title",
      accessor: "meeting_title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Timestamp",
      accessor: "schedule_date",
    },
    // {
    //     Header: "Time",
    //     accessor: "time",
    // },
    {
      Header: "Interval",
      accessor: "intervals",
    },

    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ],
  scheduled: [
    {
      Header: "Reference",
      accessor: "ID",
    },
    {
      Header: "Title",
      accessor: "meeting_title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Timestamp",
      accessor: "schedule_date",
    },
    // {
    //     Header: "Time",
    //     accessor: "time",
    // },
    {
      Header: "Interval",
      accessor: "intervals",
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
      Header: "Title",
      accessor: "meeting_title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Date",
      accessor: "completed_date",
    },
    {
      Header: "Time",
      accessor: "time",
    },
    {
      Header: "Interval",
      accessor: "intervals",
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
