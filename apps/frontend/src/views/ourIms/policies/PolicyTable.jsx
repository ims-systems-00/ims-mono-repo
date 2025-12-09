import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { deletePolicy } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import Policy from "./Policy";
const defaultdata = [{}];

const PolicyTable = ({
  dataTable,
  pathname,
  setPolicies,
  processing,
  setProcessing,
  ...rest
}) => {
  dataTable = dataTable ? dataTable : defaultdata;

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let updateDataTable = (updatedPolicy) => {
    setProcessing({ action: "update", id: updatedPolicy._id });
    setPolicies((prevPolicies) =>
      prevPolicies.map((policy) =>
        policy._id === updatedPolicy._id ? updatedPolicy : policy
      )
    );
    setProcessing({ action: null, id: null });
  };
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });
  async function handleTableButton(e, policy) {
    let policyId = policy._id;
    try {
      setProcessing({ action: "delete", id: policyId });
      infoAlert("Your request is being processed");
      await deletePolicy(policyId);
      setPolicies((prevPolicies) =>
        prevPolicies.filter((policy) => policy._id !== policyId)
      );
      successAlert("Policy has been deleted successfully");
      notify("Policy has been deleted successfully", "success");
    } catch (ex) {
      imsLogger("PolicyTable", ex.response || ex);
      notify("Could not complete the operation, error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          name: data.name,
          type: data.type,
          activateView: activateView,
          data: data,
          accessScope: data.accessScope,
          createdOn: <TimeDateComponent date={data.createdAt} />,
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
                    className="px-auto"
                    onClick={(e) => {
                      activateView(data);
                      e.stopPropagation();
                    }}
                    id="detail"
                    tooltip="View Details"
                  >
                    Details
                  </DropdownItem>
                  {data.type === "customer-managed" && (
                    <DropdownItem
                      name="delete"
                      tooltip="Delete"
                      disabled={processing.action === "delete"}
                      id="delete"
                      onClick={(e) => {
                        warningWithConfirmMessage(
                          "This incident will be escalated",
                          () => {
                            handleTableButton(e, data);
                          }
                        );
                      }}
                    >
                      {processing.action === "delete" &&
                      processing.id == data._id ? (
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
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Type",
              accessor: "type",
            },
            {
              Header: "Access Scope",
              accessor: "accessScope",
            },
            {
              Header: "Date of creation",
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
          title="Access policies"
          // isFilterable
          isSearchable
          rowProps={function (row) {
            return {
              onClick: function (e) {
                activateView(row.original.data);
              },
            };
          }}
        />
        <Modal title="Access policy">
          <Policy isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default PolicyTable;
