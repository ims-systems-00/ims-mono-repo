import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { deleteRole } from "@/services/iamRoleServices";
import { imsLogger } from "@/services/loggerService";

const defaultdata = [
  {
    _id: "",
    name: "",
    type: "",
    policy: "",
  },
];
const RolesTable = ({
  dataTable,
  pathname,
  setRoles,
  processing,
  setProcessing,
}) => {
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  const history = useHistory();
  let handleDelete = async (data) => {
    setProcessing({ action: "delete", id: data._id });
    try {
      await deleteRole(data._id);
      setRoles((prevRoles) =>
        prevRoles.filter((role) => role._id !== data._id)
      );
      successAlert("Deleted successfully");
    } catch (ex) {
      imsLogger("RolesTable", ex);
      notify("Could not delete", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data) => {
        return {
          id: data._id,
          role_name: data.name,
          type: data.type,
          policy: data.policy && data.policy.name,
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
                    size="sm"
                    onClick={history.push(`${pathname}/${data._id}`)}
                  >
                    "Edit"
                  </DropdownItem>{" "}
                  {data.type === "premitive" ? (
                    ""
                  ) : (
                    <DropdownItem
                      tooltip="Delete"
                      id="delete"
                      onClick={(e) => {
                        warningWithConfirmMessage(
                          "This role will be deleted",
                          () => {
                            handleDelete(data);
                          }
                        );
                      }}
                      size="sm"
                      // className="btn-icon  like btn-danger"
                      color="link"
                      outline
                      className="btn-link-danger border border-0"
                    >
                      {processing.action === "delete" &&
                      processing.id === data._id ? (
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
        <ReactTable
          data={data}
          resizable={false}
          columns={[
            {
              Header: "Role Name",
              accessor: "role_name",
            },
            {
              Header: "Role Type",
              accessor: "type",
            },
            {
              Header: "Role Policy",
              accessor: "policy",
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

export default RolesTable;
