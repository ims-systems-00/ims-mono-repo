import ReactTable from "@/components/ReactTable/ReactTable";
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
import moment from "moment";
import React from "react";
import { resendReport } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import Report from "./Report";

const defaultdata = [];

const ReportsTable = ({
  dataTable,
  pathname,
  setReports,
  processing,
  setProcessing,
  ...rest
}) => {
  let { activateView, Modal, isOpen } = useModal({});

  let { alert, warningWithConfirmMessage, infoAlert, successAlert } =
    useAlerts();
  let { authGlobalAccess } = useAccess();
  async function handleResend(e, data) {
    try {
      setProcessing({ action: "resend", id: data._id, error: false });
      await resendReport(data._id);
      successAlert(`Report was sent to ${data.personName} ${data.email}`);
      setProcessing({ action: null, id: null, error: false });
    } catch (ex) {
      setProcessing({ action: null, id: null, error: true });
      imsLogger("CQCReportTable", ex, ex.response);
    }
  }
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          ID: `RP-${data.ID}`,
          id: data?._id,
          group: data?.group?.name,
          personName: data?.personName,
          email: data.email,
          date: <TimeDateComponent date={data.created.on} />,
          activateView: activateView,
          data: data,
          actions: (
            <UncontrolledDropdown size="sm" direction="right">
              <DropdownToggle
                data-display="static"
                outline
                className="border border rounded-circle"
              >
                <i className="fa-solid fa-ellipsis-h" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={(e) => {
                    warningWithConfirmMessage(
                      `The report will be sent to ${data.personName}, ${data.email}`,
                      () => {
                        handleResend(e, data);
                        infoAlert("Your request is being processed");
                      }
                    );
                    e.stopPropagation();
                  }}
                  name="resend"
                  id="resend"
                  tooltip="Resend"
                >
                  {processing.action === "resend" &&
                  processing.id === data._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Resend"
                  )}
                </DropdownItem>
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
          resizable={false}
          columns={[
            {
              Header: "Reference No",
              accessor: "ID",
            },
            {
              Header: authGlobalAccess() ? "Business unit" : "Business unit",
              accessor: "group",
            },
            {
              Header: "Reported to",
              accessor: "personName",
            },
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Report date",
              accessor: "date",
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
        <Modal title="Report">
          <Report isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default ReportsTable;
