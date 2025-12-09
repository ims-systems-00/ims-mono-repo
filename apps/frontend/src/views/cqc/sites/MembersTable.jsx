import ReactTable from "@/components/ReactTable/ReactTable";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import Index from "@/views/ourIms/users/detail/Index";
const defaultdata = [];
const MembersTable = ({ dataTable, pathname, processing, ...rest }) => {
  let updateDataTable = (updatedData) => {};
  let { activateView, Modal } = useModal({ onUpdate: updateDataTable });
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          name: data.name,
          jobTitle: data.jobTitle,
          email: data.email,
          activateView: activateView,
          data: data,
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
              <DropdownMenu>
                <DropdownItem
                  onClick={(e) => {
                    activateView(data);
                    e.stopPropagation();
                  }}
                  id="detail"
                  tooltip="View Details"
                >
                  Details
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
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
          columns={[
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
              Header: "Actions",
              accessor: "actions",
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          isFilterable
          isSearchable
          rowProps={function (row) {
            return {
              onClick: function (e) {
                activateView(row.original.data);
              },
            };
          }}
        />
        <Modal title="Profile">
          <Index />
        </Modal>
      </div>
    </>
  );
};

export default MembersTable;
