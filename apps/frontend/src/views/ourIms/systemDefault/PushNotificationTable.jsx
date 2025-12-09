import ReactTable from "@/components/ReactTable/ReactTable";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";

const defaultdata = [];
const PushNotificationTable = ({ dataTable, processing, ...rest }) => {
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          message: data.msg,
          createdBy: data.created && data.created.by.name,
          createdOn:
            data.created && moment(data.created.on).format("DD/MM/YYYY"),
          actions: (
            <UncontrolledDropdown size="sm" direction="right">
              <DropdownToggle
                outline
                onClick={(e) => {
                  e.stopPropagation();
                }}
                data-display="static"
                className="border border rounded-circle"
              >
                <i className="fa-solid fa-ellipsis-h" />
              </DropdownToggle>
              <DropdownMenu></DropdownMenu>
            </UncontrolledDropdown>
          ),
        };
      }),
    [processing]
  );

  //This code is necessary for expand feature keeping it in the comment for now

  // const renderRowSubComponent = React.useCallback(
  //   ({ row }) => (
  //     <>
  //       <p>
  //         <span className="font-bold text-primary">Message : </span>
  //         {row.original.message}
  //       </p>
  //       <p>
  //         <span className="font-bold text-primary">Created by : </span>
  //         {row.original.createdBy}
  //       </p>
  //       <p>
  //         <span className="font-bold text-primary">Created on : </span>
  //         {row.original.createdOn}
  //       </p>
  //     </>
  //   ),
  //   []
  // );
  return (
    <>
      {alert}
      <div className="content mt-3">
        <ReactTable
          data={data}
          {...rest}
          // renderRowSubComponent={renderRowSubComponent}
          resizable={false}
          columns={[
            // {
            //   Header: "Expand",
            //   style: {
            //     width: "2%",
            //   },
            //   Cell: ({ row }) => {
            //     let props = { ...row.getToggleRowExpandedProps(row) }
            //     return (
            //       <span {...props}>
            //         {row.isExpanded ? (
            //           <i className="ims-icons-16 icon-icon-filearrowdown-24" />
            //         ) : (
            //           <i className="tim-icons icon-minimal-right" />
            //         )}
            //       </span>
            //     )
            //   },
            // },
            {
              Header: "Message",
              accessor: "message",
            },
            {
              Header: "Created by",
              accessor: "createdBy",
            },
            {
              Header: "Created on",
              accessor: "createdOn",
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

export default PushNotificationTable;
