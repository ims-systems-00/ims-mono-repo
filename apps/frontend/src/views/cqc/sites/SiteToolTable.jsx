import ReactTable from "@/components/ReactTable/ReactTable";
import useModal from "@/hooks/useModal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import RowExpanded from "@/views/compliance/RowExpanded";
import useCQC from "../hooks/useCqc";
import ToolControlDetails from "./ToolControlDetails";
const defaultdata = [];
const SiteToolTable = ({
  dataTable,
  updateDataTable,
  processing,
  setTool,
  dispatch,
  pathname,
  overview,
  ...rest
}) => {
  const { getRatingClasses } = useCQC();

  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          clause: data.control.clause,
          kloe: data.control.kloe,
          applies: data.control.appliesTo,
          compliance: data.compliancePercentage,
          activateView: activateView,
          data: data,
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
                {data.control.clause === "S" ? (
                  <DropdownItem
                    className={getRatingClasses(overview.safe.rating)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {overview.safe.rating}
                  </DropdownItem>
                ) : data.control.clause === "E" ? (
                  <DropdownItem
                    className={getRatingClasses(overview.effective.rating)}
                  >
                    {overview.effective.rating}
                  </DropdownItem>
                ) : data.control.clause === "C" ? (
                  <DropdownItem
                    className={getRatingClasses(overview.caring.rating)}
                  >
                    {overview.caring.rating}
                  </DropdownItem>
                ) : data.control.clause === "R" ? (
                  <DropdownItem
                    className={getRatingClasses(overview.responsive.rating)}
                  >
                    {overview.responsive.rating}
                  </DropdownItem>
                ) : data.control.clause === "W" ? (
                  <DropdownItem
                    className={getRatingClasses(overview.wellLed.rating)}
                  >
                    {overview.wellLed.rating}
                  </DropdownItem>
                ) : (
                  (!data.control.isLocked && (
                    <DropdownItem
                      //
                      id="view"
                      // size="sm"
                      tooltip="View Details"
                      onClick={(e) => {
                        activateView(data);
                        e.stopPropagation();
                      }}
                    >
                      Details
                    </DropdownItem>
                  )) || (
                    <DropdownItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      N/A
                    </DropdownItem>
                  )
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          ),
        };
      }),
    [processing]
  );

  const renderRowSubComponent = React.useCallback(
    ({ row }) => <RowExpanded row={row} />,
    []
  );

  return (
    <>
      <div className="content">
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          renderRowSubComponent={renderRowSubComponent}
          columns={[
            // {
            //   // Make an expander cell
            //   Header: "Expand", // No header
            //   // id: "expander", // It needs an ID
            //   style: {
            //     width: "6%",
            //   },
            //   Cell: ({ row }) => (
            //     <span {...row.getToggleRowExpandedProps(row)}>
            //       {row.isExpanded ? <i className="ims-icons-16 icon-icon-filearrowdown-24" /> : <i className="tim-icons icon-minimal-right" />}
            //     </span>
            //   ),
            // },
            {
              Header: "Clause",
              accessor: "clause",
              style: {
                width: "6%",
              },
            },
            {
              Header: "KLOE-Prompts",
              accessor: "kloe",
              style: {
                width: "40%",
              },
            },
            {
              Header: "Applies To",
              accessor: "applies",
              style: {
                width: "15%",
              },
            },
            {
              Header: "Compliance",
              accessor: "compliance",
              style: {
                width: "5%",
              },
            },
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: "5%",
              },
            },
          ]}
          defaultPageSize={200}
          showPaginationTop
          showPaginationBottom={true}
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
        <Modal title="KLOE details">
          <ToolControlDetails isModalOpen={isOpen} />
        </Modal>
      </div>
    </>
  );
};

export default SiteToolTable;
