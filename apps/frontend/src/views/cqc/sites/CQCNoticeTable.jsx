import ReactTable from "@/components/ReactTable/ReactTable";
import {
  DropdownItem,
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
          title: data.title,
          message: data.msg,
          createdBy: data.created && data.created.by.name,
          createdOn:
            data.created && moment(data.created.on).format("DD/MM/YYYY"),
          actions: (
            <>
              <UncontrolledDropdown size="sm" direction="right">
                <DropdownToggle
                  data-display="static"
                  outline
                  className="border border rounded-circle"
                >
                  <i className="fa-solid fa-ellipsis-h" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem id="view" tooltip="View Details">
                    View Details
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ),
        };
      }),
    [processing]
  );
  return (
    <>
      {alert}
      <div className="content">
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Title",
              accessor: "title",
            },
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
