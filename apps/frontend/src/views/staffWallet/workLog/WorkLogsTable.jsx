import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import WorkLogDetails from "./WorkLogDetails";

const defaultdata = [["No data found"]];
const WorkLogsTable = ({
  dataTable,
  pathname,
  setWorkLogs,
  processing,
  dispatch,
  ...rest
}) => {
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let { authUser, authGlobalAccess, authAdminAccess, entityAccessControl } =
    useAccess();
  let { activateView, Modal, isOpen } = useModal({});
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          reference: data.reference,
          startTime: moment(data.startTime).format("DD/MM/YYYY"),
          endTime: moment(data.endTime).format("DD/MM/YYYY"),
          type: data.type,
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
                    tooltip="View Details"
                    id="detail"
                  >
                    Details
                  </DropdownItem>
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
              Header: "Reference",
              accessor: "reference",
            },
            {
              Header: "Start time",
              accessor: "startTime",
            },

            {
              Header: "End time",
              accessor: "endTime",
            },
            {
              Header: "Type",
              accessor: "type",
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
          title={"Work logs"}
          rowProps={function (row) {
            return {
              onClick: function (e) {
                activateView(row.original.data);
              },
            };
          }}
        />
        <Modal title="Worklog Detail">
          <WorkLogDetails isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default WorkLogsTable;
