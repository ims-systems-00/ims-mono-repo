import ReactTable from "@/components/ReactTable/ReactTable";
import useAccess from "@/hooks/useAccess";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import useCQC from "../hooks/useCqc";

const defaultdata = [];
const SitesTable = ({
  dataTable,
  pathname,
  setOverviews,
  processing,
  setProcessing,
  ...rest
}) => {
  let { authGlobalAccess } = useAccess();
  const history = useHistory();

  const { getRatingClasses, getComplianceColors } = useCQC();
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data?._id,
          group: data?.group?.name,
          location: data?.group?.details?.operatingLocation,
          overall: (
            <Progress
              color={getComplianceColors(data.overall.compliancePercentage)}
              value={data.overall.compliancePercentage}
            />
          ),
          percentage: data.overall.compliancePercentage + "%",
          activateView: () => {
            //navigate to the link
            history.push(`${pathname}/${data._id}/${data.group?._id}`);
          },
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
                  onClick={() => {
                    history.push(`${pathname}/${data._id}/${data.group?._id}`);
                  }}
                  id="view"
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
      <div className="content">
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={[
            {
              Header: authGlobalAccess() ? "Business unit" : "Business unit",
              accessor: "group",
            },
            {
              Header: "Location",
              accessor: "location",
            },
            {
              Header: "Overall compliance",
              accessor: "overall",
            },
            {
              Header: "Percentage",
              accessor: "percentage",
              Cell: (item) => <span className="">{item.value}</span>,
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

export default SitesTable;
