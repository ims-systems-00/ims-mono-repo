import Loading from "@/components/Loader/Loading";
import ReactTable from "@/components/ReactTable/ReactTable";
import {
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import CreateLeave from "./CreateLeave";
import LeaveDrawerDetail from "./LeaveDrawerDetail";
import LeaveDrawerForm from "./LeaveDrawerForm";
import LeaveToolBar from "./LeaveToolBar";
import USER_ACTIONS from "./actions";
import { useLeave } from "./store";
import LeaveForm from "./LeaveForm";
const defaultdata = [["No data found"]];

const LeavesTable = (props) => {
  let { openDrawer } = useDrawer();
  let history = useHistory();
  let {
    alert,
    visitingLeave,
    toolState,
    visitLeave,
    fetchLeaves,
    processing,
    authUser,
    authGlobalAccess,
    authAdminAccess,
    entityAccessControl,
    updateDataTable,
    leaves: dataTable,
    deleteLeave,
    warningWithConfirmMessage,
    createLeave,
    ...rest
  } = useLeave();
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          reference: data.reference,
          title: data.title,
          type: data.type,
          createdOn: (
            <TimeDateComponent date={data.created && data.created.on} />
          ),
          submissionDate:
            data.submission?.status === "Draft" ? null : (
              <TimeDateComponent date={data.submission.submissionDate} />
            ),
          status: data.submission.status,
          days: data.days,
          data: data,
          actions: (
            <>
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
                      e.stopPropagation();
                      history.push(`/admin/leaves/${data._id}`);
                    }}
                    id="detail"
                    tooltip="View Details"
                  >
                    Details
                  </DropdownItem>
                  {authUser({
                    service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) &&
                    (authAdminAccess() ||
                      entityAccessControl({
                        users: data.created.by ? [data.created.by._id] : [],
                        effect: "Allow",
                      })) &&
                    data.submission.status === "Draft" && (
                      <DropdownItem
                        id="delete"
                        tooltip="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          warningWithConfirmMessage(
                            "This leave request will be deleted",
                            () => {
                              deleteLeave(data);
                            }
                          );
                        }}
                        name="delete"
                      >
                        {processing[USER_ACTIONS.DELETE_LEAVE].status &&
                        processing[USER_ACTIONS.DELETE_LEAVE].id ===
                          data._id ? (
                          <Spinner size="sm" />
                        ) : (
                          "Delete"
                        )}
                      </DropdownItem>
                    )}
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
        {processing[USER_ACTIONS.LOAD_LEAVES].status && <Loading />}
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Reference",
              accessor: "reference",
            },
            {
              Header: "Type",
              accessor: "type",
            },
            {
              Header: "Number of days",
              accessor: "days",
            },
            {
              Header: "Created on",
              accessor: "createdOn",
            },
            {
              Header: "Submitted on",
              accessor: "submissionDate",
            },

            {
              Header: "Status",
              accessor: "status",
              Cell: (item) => <BadgeStatus status={item.value} />,
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
          // isFilterable
          isSearchable
          tableToolbar={<CreateLeave />}
          title={"Leaves"}
          rowProps={function (row) {
            return {
              onClick: function (e) {
                visitLeave(row.original.data);
                openDrawer("leave-detail");
              },
            };
          }}
          processing={processing}
          onPageChange={fetchLeaves}
          pagination={toolState.pagination}
        />
        <DrawerRight
          drawerId="leave-detail"
          onDrawerClose={() => {
            visitLeave(null);
          }}
          toolbar={<LeaveToolBar />}
        >
          {visitingLeave && <LeaveDrawerDetail />}
        </DrawerRight>
        <DrawerRight drawerId="edit-leave-form">
          {visitingLeave && <LeaveDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-leave">
          <LeaveForm
            drawerView={true}
            onSubmit={async (data) => {
              await createLeave(data);
            }}
          />
        </DrawerRight>
      </div>
    </>
  );
};

export default LeavesTable;
