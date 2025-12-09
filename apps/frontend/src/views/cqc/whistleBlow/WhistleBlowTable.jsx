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
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteCqcWhistleBlow } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import tables from "./tables";
import WhistleBlowDetails from "./WhistleBlowDetails";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";

const defaultdata = [];
const WhistleBlowTable = ({
  dataTable,
  pathname,
  processing,
  setProcessing,
  setWhistleBlows,
  toolState,
  ...rest
}) => {
  let { authUser, authGlobalAccess } = useAccess();

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();

  let updateDataTable = (updatedWhistleBlow) => {
    setProcessing({ action: "update", id: updatedWhistleBlow._id });
    setWhistleBlows((prevWhistleBlows) =>
      prevWhistleBlows.map((whistleBlow) =>
        whistleBlow._id === updatedWhistleBlow._id
          ? updatedWhistleBlow
          : whistleBlow
      )
    );
    setProcessing({ action: null, id: null });
  };
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });

  async function handleTableButton(e, whistleBlow) {
    try {
      let actionType = e.target.name;
      let whistleBlowId = whistleBlow._id;
      switch (actionType) {
        case "delete": {
          setProcessing({ action: "delete", id: whistleBlowId });
          await deleteCqcWhistleBlow(whistleBlowId);
          setWhistleBlows((prevWhistleBlows) =>
            prevWhistleBlows.filter(
              (whistleBlow) => whistleBlow._id !== whistleBlowId
            )
          );
          notify("Whistleblow deleted successfully", "success");
          successAlert("Whistleblow deleted successfully");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("WhistleBlowTable", ex.response || ex);
      notify("Unknown server error occured", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  dataTable = dataTable ? dataTable : defaultdata;

  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data?._id,
          ID: "WB-" + data.ID,
          group: (
            <span
              className={
                data.statementOfDisclosureThree.status ? "text-warning" : ""
              }
            >
              {data.statementOfDisclosureThree.status
                ? "Anonymous"
                : data.group && data?.group?.name}
            </span>
          ),

          createdBy: data.statementOfDisclosureThree.status
            ? "Anonymous"
            : data.created && data?.created?.by?.name,
          closedBy: data.signed?.by?.name,
          status: (
            <BadgeStatus status={data.signed.status ? "Closed" : "Open"} />
          ),
          title: data.title,
          reportedTo: data?.reportedTo?.name,
          activateView: activateView,
          data: data,
          date: data.signed?.status ? (
            <TimeDateComponent date={data.signed?.on} />
          ) : (
            <TimeDateComponent date={data.created?.on} />
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
                          "This whistleblow will be deleted",
                          () => {
                            handleTableButton(e, data);
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
        <Modal title="Whistleblowing">
          <WhistleBlowDetails isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default WhistleBlowTable;
