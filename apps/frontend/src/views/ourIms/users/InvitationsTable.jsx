import ReactTable from "@/components/ReactTable/ReactTable";
import useAlerts from "@/hooks/useAlerts";
import {
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import { useUserManager } from "./store";
import Box from "@/components/Box/Index";
const defaultdata = [["No data found"]];

const InvitationsTable = ({ ...props }) => {
  let { alert } = useAlerts();
  const {
    processing,
    invitations,
    resendInvite,
    deleteInvite,
    invitationsQueryHandlers,
  } = useUserManager();
  const data = React.useMemo(
    () =>
      invitations.map((data, key) => {
        return {
          id: data._id,
          email: data.email,
          status: "Sent",
          updatedAt: <TimeDateComponent date={data.updatedAt} />,
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
                {/* <DropdownItem id="detail" tooltip="View Details">
                  Details
                </DropdownItem> */}
                <DropdownItem
                  id="detail"
                  tooltip="View Details"
                  onClick={() => resendInvite(data._id)}
                >
                  Resend
                </DropdownItem>
                <DropdownItem
                  id="detail"
                  tooltip="View Details"
                  onClick={() => deleteInvite(data._id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ),
        };
      }),
    [processing, invitations]
  );
  return (
    <div className="content">
      <Box>
        {alert}
        <ReactTable
          data={data}
          resizable={false}
          columns={[
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Staus",
              accessor: "status",
            },

            {
              Header: "Sent on",
              accessor: "updatedAt",
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
          tableToolbar={<React.Fragment></React.Fragment>}
          // filterToolbar={<IncidentFilter />}
          title="Invited people"
          rowProps={function (row) {
            return {
              onClick: function (e) {
                // visitOrganisation(row.original?.data);
                // openDrawer("incident-detail");
              },
            };
          }}
          {...invitationsQueryHandlers}
          {...props}
          // {...rest}
          // onPageChange={fetchIncidents}
          pagination={invitationsQueryHandlers.toolState.pagination}
          isFilterable
          isSearchable
        />
        <DrawerRight
          drawerId="incident-detail"
          onDrawerClose={() => {
            // visitOrganisation(null);
          }}
        >
          {/* {<OrganisationDetails />} */}
        </DrawerRight>
      </Box>
    </div>
  );
};

export default InvitationsTable;
