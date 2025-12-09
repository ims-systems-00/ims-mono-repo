import React from "react";

import ReactTable from "@/components/ReactTable/ReactTable";
import useAlerts from "@/hooks/useAlerts";

import TooltipLink from "@/components/Tooltip/TooltipLink";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
const defaultdata = [];

const UserTable = ({
  dataTable,
  pathname,
  setusers,
  processing,
  btnProcessing,
  setProcessing,
}) => {
  dataTable = dataTable ? dataTable : defaultdata;
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let { authUser } = useAccess(getCurrentUserInfo());
  async function handleTableButton(e, user) {
    try {
    } catch (ex) {
      imsLogger("GroupUserTable", ex.response || ex);
      notify("Could not complete the operation, error occurred", "danger");
    }
    setProcessing(false);
  }
  const data = React.useMemo(
    () =>
      dataTable.map((user, key) => {
        return {
          id: user._id,
          name: user.name,
          group: user.businessFunctionId.name,
          jobTitile: user.jobTitle,
          status: user.siteAccess,
          actions: (
            <div className="actions-right">
              <TooltipLink
                size="sm"
                id="detail"
                tooltip="View Details"
                to={`${pathname}/`}
              >
                <i className="tim-icons icon-pencil" />
              </TooltipLink>{" "}
            </div>
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
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Group",
              accessor: "group",
            },
            {
              Header: "Job title",
              accessor: "jobTitle",
            },
            {
              Header: "Status",
              accessor: "status",
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

export default UserTable;
