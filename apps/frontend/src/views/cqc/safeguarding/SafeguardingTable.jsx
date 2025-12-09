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
import moment from "moment";
import React, { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteSafeguarding } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import useSafeguarding from "./hooks/useSafeguarding";
import Safeguarding from "./Safeguarding";
import tables from "./tables";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";

const defaultdata = [];
const SafeguardingTable = ({
  dataTable,
  pathname,
  setSafeguardings,
  processing,
  setProcessing,
  toolState,
  ...rest
}) => {
  let { isClosedSafeguarding } = useSafeguarding();
  let { alert, warningWithConfirmMessage, infoAlert, successAlert } =
    useAlerts();
  let { authUser, authGlobalAccess } = useAccess();

  let notify = useContext(NotificationContext);

  let updateDataTable = (updatedSafeguarding) => {
    setProcessing({ action: "update", id: updatedSafeguarding._id });
    setSafeguardings((prevSafeguardings) =>
      prevSafeguardings.map((safeguarding) =>
        safeguarding._id === updatedSafeguarding._id
          ? updatedSafeguarding
          : safeguarding
      )
    );
    setProcessing({ action: null, id: null });
  };
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });

  async function handleTableButton(e, safeguarding) {
    try {
      let actionType = e.target.name;
      let safeguardingId = safeguarding._id;
      switch (actionType) {
        case "delete": {
          setProcessing({ action: "delete", id: safeguardingId });
          await deleteSafeguarding(safeguardingId);
          setSafeguardings((prevSafeguardings) =>
            prevSafeguardings.filter(
              (safeguarding) => safeguarding._id !== safeguardingId
            )
          );
          notify("Safeguarding deleted successfully", "success");
          successAlert("Safeguarding deleted successfully");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("SafeguardingTable", ex.response || ex);
      notify("Unknown server error occured", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          ID: `SG-${data.ID}`,
          id: data?._id,
          group: data?.group?.name,
          personAffected: data?.personAffected,
          createdBy: data?.created?.by?.name,
          closedBy: data?.signed?.by?.name,
          activateView: activateView,
          data: data,
          date: data.signed?.status ? (
            <TimeDateComponent date={data.signed?.on} />
          ) : (
            <TimeDateComponent date={data.created?.on} />
          ),
          status: (
            <BadgeStatus status={data.signed.status ? "Reported" : "Closed"} />
          ),
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
                {authUser({
                  service: IMS_SERVICES.CQC,
                  action: ACTIONS.DELETE,
                  effect: EFFECTS.ALLOW,
                }) &&
                  !data.signed.status && (
                    <DropdownItem
                      onClick={(e) => {
                        warningWithConfirmMessage(
                          `Safeguarding ${data.ID} will be deleted`,
                          () => {
                            handleTableButton(e, data);
                            infoAlert("Your request is being processed");
                          }
                        );
                        e.stopPropagation();
                      }}
                      name="delete"
                      id="delete"
                      tooltip="Delete"
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
          ),
        };
      }),
    [processing]
  );
  let columns = React.useMemo(
    () => toolState.filter.tableState || tables.default,
    [toolState]
  );
  return (
    <>
      {alert}
      <div className="content">
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={columns.slice()}
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
        <Modal title="Safeguarding">
          <Safeguarding isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default SafeguardingTable;
