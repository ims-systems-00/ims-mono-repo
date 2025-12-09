import ReactTable from "@/components/ReactTable/ReactTable";

const ReactTables = ({ dataTable, ...rest }) => {
  return (
    <>
      <div className="content">
        <ReactTable
          data={dataTable}
          filterable
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Reference",
              accessor: "ID",
            },
            {
              Header: "Task",
              accessor: "name",
            },
            {
              Header: "Due date",
              accessor: "due",
            },
            {
              Header: "Added by",
              accessor: "addedBy",
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false,
            },
          ]}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          isFilterable
          isSearchable
        />
      </div>
    </>
  );
};

export default ReactTables;
