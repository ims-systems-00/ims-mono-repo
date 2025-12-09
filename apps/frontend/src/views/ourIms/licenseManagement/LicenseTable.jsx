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
import React from "react";
import { IMS_POLICIES } from "@/rolesAndPermissions";
import ManageLicense from "./ManageLicense";

const defaultdata = [["No data found"]];
const LicenseTable = ({
  dataTable,
  pathname,
  setGroups,
  processing,
  setProcessing,
  ...rest
}) => {
  dataTable = dataTable ? dataTable : defaultdata;

  let notify = React.useContext(NotificationContext);
  let { alert } = useAlerts();
  let { authGlobalAccess } = useAccess();
  let updateDataTable = (updatedData) => {
    setProcessing({ action: "update", id: updatedData._id });
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group._id === updatedData._id ? updatedData : group
      )
    );
    setProcessing({ action: null, id: null });
  };
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });
  const data = React.useMemo(
    () =>
      dataTable.map((group, key) => {
        return {
          id: group._id,
          name: group.name,
          accessPolicy: group.policy?.name,
          hos:
            group.policy?.name !== IMS_POLICIES.IMS_COMPLIANCE_FUNCTION
              ? `${group.userLicenses.hosUser.used}`
              : "N/A",
          basic:
            group.policy?.name !== IMS_POLICIES.IMS_COMPLIANCE_FUNCTION
              ? `${group.userLicenses.basicUser.used}`
              : "N/A",
          auditor:
            group.policy?.name === IMS_POLICIES.IMS_COMPLIANCE_FUNCTION
              ? `${group.userLicenses.auditorUser.used}`
              : "N/A",
          activateView: activateView,
          data: group,
          totalStaff:
            group.userLicenses?.hosUser?.used +
            group.userLicenses?.basicUser?.used +
            group.userLicenses?.auditorUser?.used,
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
                  {group.name !== IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION ? (
                    <>
                      <DropdownItem
                        onClick={(e) => {
                          activateView(group);
                          e.stopPropagation();
                        }}
                        id="detail"
                        tooltip="View Details"
                      >
                        Details
                      </DropdownItem>
                    </>
                  ) : (
                    <span>Default</span>
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
              Header: authGlobalAccess() ? "Business unit" : "Business unit",
              accessor: "name",
            },
            {
              Header: "Access Policy",
              accessor: "accessPolicy",
            },
            {
              Header: "Basic",
              accessor: "basic",
            },
            {
              Header: "HOs",
              accessor: "hos",
            },

            {
              Header: "Auditor",
              accessor: "auditor",
            },
            {
              Header: "Total number of staff",
              accessor: "totalStaff",
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false,
            },
          ]}
          title={"Business units"}
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
        <Modal title="Licence management">
          <ManageLicense isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default LicenseTable;
