import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
  Badge,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { handleRequestApproval } from "@/services/licensemanagementServices";
import { imsLogger } from "@/services/loggerService";
import LicenseDetail from "./LicenseDetail";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";

const defaultdata = [["No data found"]];
const RequestsTable = ({
  dataTable,
  pathname,
  setLicensesRequests,
  processing,
  setProcessing,
  ...rest
}) => {
  dataTable = dataTable ? dataTable : defaultdata;

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let { authUser, authGlobalAccess } = useAccess();
  async function handleTableButton(e, data) {
    let actionType = e.target.name;
    let requestId = data._id;
    try {
      switch (actionType) {
        case "grant": {
          setProcessing({ action: "grant", id: requestId });
          let { data } = await handleRequestApproval(
            requestId,
            "status=Approve"
          );
          setLicensesRequests((prevRequests) =>
            prevRequests.map((request) => {
              return request._id === requestId ? data.request : request;
            })
          );
          notify("Licence request approved successfully", "success");
          break;
        }
        case "decline": {
          setProcessing({ action: "decline", id: requestId });
          let { data } = await handleRequestApproval(
            requestId,
            "status=Declined"
          );
          setLicensesRequests((prevRequests) =>
            prevRequests.map((request) => {
              return request._id === requestId ? data.request : request;
            })
          );
          notify("Licence request declined successfully", "success");
          break;
        }
      }
    } catch (ex) {
      imsLogger("RequestTable", ex.response || ex);
      notify(
        (ex.response && ex.response.data.message) ||
          "Could not complete the operation, error occurred",
        "danger"
      );
    }
    setProcessing({ action: null, id: null });
  }
  let { activateView, Modal, isOpen } = useModal();

  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          reference: `${data.reference}`,
          name: data.group && data.group.name,
          type: data.type,
          groups:
            data.type === "Organisational" ? data.groups.requested : "N/A",
          users: data.users.requested,
          status: data.granted.status,
          activateView: activateView,
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
                      activateView(data);
                      e.stopPropagation();
                    }}
                    id="detail"
                    tooltip="View Details"
                  >
                    Details
                  </DropdownItem>
                  {data.granted.status === "Open" ? (
                    authUser({
                      service: IMS_SERVICES.LICENSE_MANAGEMENT,
                      action: ACTIONS.ALL,
                      effect: EFFECTS.ALLOW,
                    }) && (
                      <>
                        <DropdownItem
                          name="grant"
                          disabled={processing.action === "grant"}
                          id="grant-access"
                          tooltip="Grant"
                          onClick={(e) => {
                            warningWithConfirmMessage(
                              "Licence request will be approved",
                              () => {
                                handleTableButton(e, data);
                              }
                            );
                          }}
                        >
                          {processing.action === "grant" &&
                          processing.id == data._id ? (
                            <Spinner size="sm" />
                          ) : (
                            // <i className="tim-icons icon-check-2" />
                            "Grant"
                          )}
                        </DropdownItem>
                        <DropdownItem
                          name="decline"
                          tooltip="Decline"
                          disabled={processing.action === "decline"}
                          // color={"danger"}
                          // size="sm"
                          id="decline-access"
                          // className={`btn-icon  like `}
                          onClick={(e) => {
                            warningWithConfirmMessage(
                              "Licence request will be declined",
                              () => {
                                handleTableButton(e, data);
                              }
                            );
                          }}
                        >
                          {processing.action === "decline" &&
                          processing.id == data._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              {/* <i className="tim-icons icon-simple-remove" /> */}
                              Decline
                            </>
                          )}
                        </DropdownItem>
                      </>
                    )
                  ) : data.granted.status === "Pending" ? (
                    <span className="text-danger ml-3 ">iMS managed</span>
                  ) : (
                    <span className="text-danger ml-3">Closed</span>
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
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Reference ID",
              accessor: "reference",
            },
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Business unit licenses",
              accessor: "groups",
            },
            {
              Header: "User licenses",
              accessor: "users",
            },

            {
              Header: "Status",
              accessor: "status",
              Cell: (item) => <BadgeStatus status={item.value} />,
            },
            {
              Header: "Requested date",
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
          // isFilterable
          isSearchable
          title="License requests"
          rowProps={function (row) {
            return {
              onClick: function (e) {
                activateView(row.original.data);
              },
            };
          }}
        />
        <Modal title="Requested licence">
          <LicenseDetail isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default RequestsTable;
