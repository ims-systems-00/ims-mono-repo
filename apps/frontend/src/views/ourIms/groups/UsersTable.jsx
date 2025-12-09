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
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import { changeImsAccess, deleteUserFromGroup } from "@/services/userServices";
import Index from "../users/detail/Index";
import LOADERS from "./LoadingActions";
const defaultdata = [];

const UsersTable = ({
  dataTable,
  pathname,
  setMembers,
  group,
  processing,
  dispatch,
  reload,
  ...rest
}) => {
  dataTable = dataTable ? dataTable : defaultdata;
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let { authUser } = useAccess();
  let updateDataTable = (updatedData) => {
    dispatch({
      [LOADERS.LOAD_USERS]: { status: true, error: false, id: null },
    });
    setMembers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedData._id ? updatedData : user
      )
    );
    dispatch({
      [LOADERS.LOAD_USERS]: { status: false, error: false, id: null },
    });
  };
  let { activateView, Modal } = useModal({ onUpdate: updateDataTable });

  async function handleTableButton(e, data) {
    let actionType = e.target.name;
    let memberId = data._id;
    try {
      switch (actionType) {
        case "grant": {
          dispatch({
            [LOADERS.ADD_MEMBERS]: { status: true, error: false, id: memberId },
          });
          infoAlert("Your is being processed");
          let { data } = await changeImsAccess(
            memberId,
            `status=Active&group=${group._id}`
          );
          setMembers((prevMembers) =>
            prevMembers.map((member) => {
              return member._id === memberId ? data.user : member;
            })
          );
          notify("Access granted to a member successfully", "success");
          successAlert("Access granted to a member successfully");
          dispatch({
            [LOADERS.ADD_MEMBERS]: { status: false, error: false, id: null },
          });
          break;
        }
        case "revoke": {
          dispatch({
            [LOADERS.REVOKE_USER]: { status: true, error: false, id: memberId },
          });
          infoAlert("Your is being processed");
          let { data } = await changeImsAccess(
            memberId,
            `status=Blocked&group=${group._id}`
          );
          setMembers((prevMembers) =>
            prevMembers.map((member) => {
              return member._id === memberId ? data.user : member;
            })
          );
          notify("Access revoked from a member successfully", "success");
          successAlert("Access revoked from a member successfully");
          dispatch({
            [LOADERS.REVOKE_USER]: { status: false, error: false, id: null },
          });
          break;
        }
        case "remove": {
          dispatch({
            [LOADERS.REMOVE_USER]: { status: true, error: false, id: memberId },
          });
          infoAlert("Your request is being processed");
          successAlert(`${data.name} removed successfully`);
          await deleteUserFromGroup(memberId, group._id);
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member._id !== memberId)
          );
          reload && reload();
          notify(`${data.name} removed successfully`, "success");
          dispatch({
            [LOADERS.REMOVE_USER]: { status: false, error: false, id: null },
          });
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("UserTable", ex.response || ex);
      notify("Could not complete the operation, error occurred", "danger");
    }
  }

  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        let policy = data.accessPolicies.find(
          (policy) => policy.group?._id === group?._id
        );
        return {
          id: data._id,
          name: data.name,
          activateView: activateView,
          data: data,
          email: data.email,
          jobTitle: data.jobTitle,
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
                    View Details
                  </DropdownItem>{" "}
                  {authUser({
                    service: IMS_SERVICES.USERS,
                    action: ACTIONS.CREATE,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <DropdownItem
                      name="remove"
                      disabled={processing[LOADERS.REMOVE_USER].status}
                      id="remove"
                      tooltip="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        warningWithConfirmMessage(
                          `${data.name} will be removed from ${group.name}`,
                          () => {
                            handleTableButton(e, data);
                          }
                        );
                      }}
                    >
                      {processing[LOADERS.REMOVE_USER].status &&
                      processing[LOADERS.REMOVE_USER].id == data._id ? (
                        <Spinner size="sm" />
                      ) : (
                        "Remove"
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
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
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

export default UsersTable;
