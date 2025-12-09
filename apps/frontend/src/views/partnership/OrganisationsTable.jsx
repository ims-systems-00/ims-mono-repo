import Loading from "@/components/Loader/Loading";
import ReactTable from "@/components/ReactTable/ReactTable";
import useAlerts from "@/hooks/useAlerts";
import {
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import NotificationContext from "../../contexts/notificationContext";
import { USER_ACTIONS, usePartnershipDB } from "./store";
import OrganisationDetails from "./OrganisationDetails";
const defaultdata = [["No data found"]];

const OrganisationsTable = ({ ...props }) => {
  let { openDrawer, closeDrawer } = useDrawer();
  let history = useHistory();
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  const {
    processing,
    organizations,
    orgTableQueryHandlers,
    visitOrganisation,
  } = usePartnershipDB();
  const data = React.useMemo(
    () =>
      organizations.map((data, key) => {
        return {
          id: data._id,
          name: data.name,
          users: data.licenses.users.allocated,
          groups: data.licenses.groups.allocated,
          superUser: data.licenses.superUser.allocated,
          createdOn: <TimeDateComponent date={data.createdAt} />,
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
                <DropdownItem id="detail" tooltip="View Details">
                  Details
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ),
        };
      }),
    [processing, organizations]
  );
  return (
    <>
      {alert}
      <div className="content">
        {processing[USER_ACTIONS.LOAD_ORGS].status && <Loading />}
        <ReactTable
          data={data}
          resizable={false}
          columns={[
            {
              Header: "Organisation",
              accessor: "name",
            },
            {
              Header: "Super user(s)",
              accessor: "superUser",
            },
            {
              Header: "User(s)",
              accessor: "users",
            },
            {
              Header: "Business unit(s)",
              accessor: "groups",
            },
            {
              Header: "Started on",
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
          tableToolbar={<React.Fragment></React.Fragment>}
          // filterToolbar={<IncidentFilter />}
          title="Organisations"
          rowProps={function (row) {
            return {
              onClick: function (e) {
                visitOrganisation(row.original?.data);
                openDrawer("incident-detail");
              },
            };
          }}
          {...orgTableQueryHandlers}
          {...props}
          // {...rest}
          // onPageChange={fetchIncidents}
          pagination={orgTableQueryHandlers.toolState.pagination}
          isFilterable
          isSearchable
        />
        <DrawerRight
          drawerId="incident-detail"
          onDrawerClose={() => {
            visitOrganisation(null);
          }}
        >
          {<OrganisationDetails />}
        </DrawerRight>
      </div>
    </>
  );
};

export default OrganisationsTable;
